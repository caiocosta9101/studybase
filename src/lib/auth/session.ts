import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const sessionCookieName = "studybase_session";
const sessionVersion = 1;
const sessionDurationSeconds = 7 * 24 * 60 * 60;
// Aceita no máximo um minuto de diferença entre relógios do cliente e do servidor.
const maximumFutureIssuedAtSeconds = 60;
const minimumSecretBytes = 32;

const sharedCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
};

type SessionPayload = {
  v: typeof sessionVersion;
  sub: string;
  iat: number;
  exp: number;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export async function createSession(userId: string) {
  if (typeof userId !== "string" || !userId.trim()) {
    throw new Error("Não foi possível criar a sessão.");
  }

  const issuedAt = getCurrentTimestamp();
  const expiresAt = issuedAt + sessionDurationSeconds;
  const payload: SessionPayload = {
    v: sessionVersion,
    sub: userId,
    iat: issuedAt,
    exp: expiresAt
  };
  const payloadSegment = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signatureSegment = signPayloadSegment(payloadSegment);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, `${payloadSegment}.${signatureSegment}`, {
    ...sharedCookieOptions,
    maxAge: sessionDurationSeconds,
    expires: new Date(expiresAt * 1000)
  });
}

export async function readSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(sessionCookieName)?.value;

  if (!sessionValue) {
    return null;
  }

  const payload = validateSessionValue(sessionValue);

  return payload?.sub ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, "", {
    ...sharedCookieOptions,
    maxAge: 0,
    expires: new Date(0)
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await readSession();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true
    }
  });

  if (!user?.passwordHash) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return currentUser;
}

function validateSessionValue(sessionValue: string): SessionPayload | null {
  const segments = sessionValue.split(".");

  if (segments.length !== 2) {
    return null;
  }

  const [payloadSegment, signatureSegment] = segments;
  const payloadBuffer = decodeBase64Url(payloadSegment);
  const providedSignature = decodeBase64Url(signatureSegment);

  if (!payloadBuffer || !providedSignature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getSessionSecret()).update(payloadSegment).digest();

  if (providedSignature.length !== expectedSignature.length || !timingSafeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  const payload = parseSessionPayload(payloadBuffer);

  if (!payload || !hasValidTimestamps(payload)) {
    return null;
  }

  return payload;
}

function signPayloadSegment(payloadSegment: string) {
  return createHmac("sha256", getSessionSecret()).update(payloadSegment).digest("base64url");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || !secret.trim() || Buffer.byteLength(secret, "utf8") < minimumSecretBytes) {
    throw new Error("SESSION_SECRET deve estar definido e ter pelo menos 32 bytes UTF-8.");
  }

  return secret;
}

function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return null;
  }

  const decodedValue = Buffer.from(value, "base64url");

  return decodedValue.toString("base64url") === value ? decodedValue : null;
}

function parseSessionPayload(payloadBuffer: Buffer): SessionPayload | null {
  let parsedPayload: unknown;

  try {
    parsedPayload = JSON.parse(payloadBuffer.toString("utf8"));
  } catch {
    return null;
  }

  if (!isPlainObject(parsedPayload)) {
    return null;
  }

  const payloadKeys = Object.keys(parsedPayload);
  const expectedKeys = ["v", "sub", "iat", "exp"];

  if (payloadKeys.length !== expectedKeys.length || !expectedKeys.every((key) => key in parsedPayload)) {
    return null;
  }

  if (
    parsedPayload.v !== sessionVersion ||
    typeof parsedPayload.sub !== "string" ||
    !parsedPayload.sub.trim() ||
    typeof parsedPayload.iat !== "number" ||
    typeof parsedPayload.exp !== "number" ||
    !Number.isSafeInteger(parsedPayload.iat) ||
    !Number.isSafeInteger(parsedPayload.exp)
  ) {
    return null;
  }

  return {
    v: parsedPayload.v,
    sub: parsedPayload.sub,
    iat: parsedPayload.iat,
    exp: parsedPayload.exp
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function hasValidTimestamps(payload: SessionPayload) {
  const now = getCurrentTimestamp();

  return (
    payload.iat >= 0 &&
    payload.exp > payload.iat &&
    payload.exp - payload.iat <= sessionDurationSeconds &&
    payload.exp > now &&
    payload.iat <= now + maximumFutureIssuedAtSeconds
  );
}

function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}
