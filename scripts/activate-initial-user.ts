import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword, validatePassword } from "../src/lib/auth/password";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

async function main() {
  const email = getRequiredValue("STUDYBASE_INITIAL_USER_EMAIL").trim();
  const password = getRequiredValue("STUDYBASE_INITIAL_USER_PASSWORD");

  if (!isValidEmail(email)) {
    throw new Error("Dados de ativação inválidos.");
  }

  validatePassword(password);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true
    }
  });

  if (!user || user.passwordHash) {
    throw new Error("Não foi possível ativar a conta inicial.");
  }

  const passwordHash = await hashPassword(password);
  const updatedUser = await prisma.user.updateMany({
    where: {
      id: user.id,
      passwordHash: null
    },
    data: {
      passwordHash
    }
  });

  if (updatedUser.count !== 1) {
    throw new Error("Não foi possível ativar a conta inicial.");
  }

  console.log("Conta inicial ativada com sucesso.");
}

function getRequiredValue(variableName: string) {
  const value = process.env[variableName];

  if (!value) {
    throw new Error("Dados de ativação não foram informados.");
  }

  return value;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

main()
  .catch(() => {
    console.error("Não foi possível ativar a conta inicial.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
