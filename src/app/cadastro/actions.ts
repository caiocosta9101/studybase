"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const maximumNameLength = 100;
const maximumEmailLength = 254;
const minimumPasswordLength = 12;
const maximumPasswordLength = 128;

type RegistrationError =
  | "invalid_data"
  | "invalid_name"
  | "invalid_email"
  | "invalid_password"
  | "password_mismatch"
  | "registration_failed"
  | "registration_unavailable";

export async function registerAction(formData: FormData) {
  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const passwordConfirmationValue = formData.get("passwordConfirmation");

  if (
    typeof nameValue !== "string" ||
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string" ||
    typeof passwordConfirmationValue !== "string"
  ) {
    redirectToRegistrationError("invalid_data");
  }

  const name = nameValue.trim();
  const email = emailValue.trim().toLowerCase();

  if (!name || name.length > maximumNameLength) {
    redirectToRegistrationError("invalid_name");
  }

  if (!hasValidEmail(email)) {
    redirectToRegistrationError("invalid_email");
  }

  if (passwordValue.length < minimumPasswordLength || passwordValue.length > maximumPasswordLength) {
    redirectToRegistrationError("invalid_password");
  }

  if (passwordConfirmationValue !== passwordValue) {
    redirectToRegistrationError("password_mismatch");
  }

  let passwordHash: string | null = null;

  try {
    passwordHash = await hashPassword(passwordValue);
  } catch {
    passwordHash = null;
  }

  if (!passwordHash) {
    redirectToRegistrationError("registration_unavailable");
  }

  let userId: string | null = null;
  let creationError: RegistrationError | null = null;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      },
      select: {
        id: true
      }
    });

    userId = user.id;
  } catch (error) {
    creationError = isUniqueConstraintViolation(error) ? "registration_failed" : "registration_unavailable";
  }

  if (creationError) {
    redirectToRegistrationError(creationError);
  }

  if (!userId) {
    redirectToRegistrationError("registration_unavailable");
  }

  let sessionCreated = false;

  try {
    await createSession(userId);
    sessionCreated = true;
  } catch {
    sessionCreated = false;
  }

  if (!sessionCreated) {
    redirect("/login?status=account_created");
  }

  redirect("/dashboard");
}

function hasValidEmail(email: string) {
  return email.length > 0 && email.length <= maximumEmailLength && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isUniqueConstraintViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function redirectToRegistrationError(error: RegistrationError): never {
  redirect(`/cadastro?error=${error}`);
}
