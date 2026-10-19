-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'LGA_CHAIRMAN', 'PROPERTY_OWNER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED');

-- CreateEnum
CREATE TYPE "LgaStatus" AS ENUM ('ACTIVE', 'ONBOARDING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "lgaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lgas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "LgaStatus" NOT NULL DEFAULT 'ONBOARDING',
    "chairmanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lgas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_lgaId_idx" ON "users"("lgaId");

-- CreateIndex
CREATE UNIQUE INDEX "lgas_state_name_key" ON "lgas"("state", "name");

-- CreateIndex
CREATE UNIQUE INDEX "lgas_chairmanId_key" ON "lgas"("chairmanId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lgaId_fkey" FOREIGN KEY ("lgaId") REFERENCES "lgas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lgas" ADD CONSTRAINT "lgas_chairmanId_fkey" FOREIGN KEY ("chairmanId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
