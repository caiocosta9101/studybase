import { randomBytes, scrypt, timingSafeEqual } from "crypto";

const algorithm = "scrypt";
const version = "v1";
const parameters = "N=131072,r=8,p=1";
const saltLength = 16;
const digestLength = 64;

const scryptOptions = {
  cost: 131_072,
  blockSize: 8,
  parallelization: 1,
  maxmem: 256 * 1024 * 1024
};

export function validatePassword(password: string) {
  if (!hasValidPasswordLength(password)) {
    throw new Error("Senha inválida.");
  }
}

export async function hashPassword(password: string) {
  validatePassword(password);

  const salt = await createSalt();
  const digest = await deriveKey(password, salt);

  return [algorithm, version, parameters, salt.toString("base64"), digest.toString("base64")].join(":");
}

export async function verifyPassword(password: string, storedHash: string) {
  if (!hasValidPasswordLength(password)) {
    return false;
  }

  const parsedHash = parseStoredHash(storedHash);

  if (!parsedHash) {
    return false;
  }

  try {
    const candidateDigest = await deriveKey(password, parsedHash.salt);

    return timingSafeEqual(candidateDigest, parsedHash.digest);
  } catch {
    return false;
  }
}

async function createSalt() {
  return new Promise<Buffer>((resolve, reject) => {
    randomBytes(saltLength, (error, bytes) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(bytes);
    });
  });
}

async function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, digestLength, scryptOptions, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

function parseStoredHash(storedHash: string) {
  if (typeof storedHash !== "string") {
    return null;
  }

  const parts = storedHash.split(":");

  if (parts.length !== 5) {
    return null;
  }

  const [storedAlgorithm, storedVersion, storedParameters, saltValue, digestValue] = parts;

  if (storedAlgorithm !== algorithm || storedVersion !== version || storedParameters !== parameters) {
    return null;
  }

  const salt = decodeBase64(saltValue);
  const digest = decodeBase64(digestValue);

  if (!salt || !digest || salt.length !== saltLength || digest.length !== digestLength) {
    return null;
  }

  return { salt, digest };
}

function hasValidPasswordLength(password: unknown): password is string {
  return typeof password === "string" && password.length >= 12 && password.length <= 128;
}

function decodeBase64(value: string) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length % 4 !== 0) {
    return null;
  }

  const decodedValue = Buffer.from(value, "base64");

  return decodedValue.toString("base64") === value ? decodedValue : null;
}
