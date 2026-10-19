import "dotenv/config";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { UserRole, UserStatus } from "../generated/prisma/enums";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const demoUsers = [
  {
    name: "Amina Yusuf",
    email: "amina@lga.gov",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    password: "demo1234",
  },
  {
    name: "Kunle Adeyemi",
    email: "kunle@lga.gov",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    password: "demo1234",
  },
  {
    name: "Musa Bello",
    email: "musa@email.com",
    role: UserRole.PROPERTY_OWNER,
    status: UserStatus.ACTIVE,
    password: "demo1234",
  },
  {
    name: "Chioma Eze",
    email: "chioma@email.com",
    role: UserRole.PROPERTY_OWNER,
    status: UserStatus.INVITED,
    password: "demo1234",
  },
] as const;

async function main() {
  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        status: user.status,
        passwordHash,
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        passwordHash,
      },
    });
  }

  const count = await prisma.user.count();
  console.log(`Seeded users. Total in database: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
