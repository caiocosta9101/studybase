"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth/password";
import { clearSession, createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const invalidCredentialsPath = "/login?error=invalid_credentials";
const maximumEmailLength = 254;
const maximumPasswordLength = 128;

export async function loginAction(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    redirectToInvalidCredentials();
  }

  const email = emailValue.trim().toLowerCase();

  if (!hasValidCredentialsInput(email, passwordValue)) {
    redirectToInvalidCredentials();
  }

  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      passwordHash: true
    }
  });

  if (!user?.passwordHash || !(await verifyPassword(passwordValue, user.passwordHash))) {
    redirectToInvalidCredentials();
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

function hasValidCredentialsInput(email: string, password: string) {
  return (
    email.length > 0 &&
    email.length <= maximumEmailLength &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 12 &&
    password.length <= maximumPasswordLength
  );
}

function redirectToInvalidCredentials(): never {
  redirect(invalidCredentialsPath);
}
