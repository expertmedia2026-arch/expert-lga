-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('FLAT', 'HOUSE', 'BUNGALOW', 'SHOP', 'OFFICE', 'WAREHOUSE', 'MIXED_USE');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "surname" TEXT NOT NULL,
    "otherNames" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "occupation" TEXT NOT NULL,
    "employer" TEXT,
    "countryOfOrigin" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "localGovernment" TEXT NOT NULL,
    "homeTown" TEXT NOT NULL,
    "dependents" INTEGER NOT NULL DEFAULT 0,
    "propertyLabel" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "tenancyStart" DATE NOT NULL,
    "tenancyEnd" DATE NOT NULL,
    "amountPaid" DECIMAL(14,2) NOT NULL,
    "outstandingBalance" DECIMAL(14,2) NOT NULL,
    "kinFullName" TEXT NOT NULL,
    "kinRelationship" TEXT NOT NULL,
    "kinPhone" TEXT NOT NULL,
    "kinAddress" TEXT NOT NULL,
    "loginEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_loginEmail_key" ON "tenants"("loginEmail");

-- CreateIndex
CREATE INDEX "tenants_ownerId_idx" ON "tenants"("ownerId");

-- CreateIndex
CREATE INDEX "tenants_propertyLabel_idx" ON "tenants"("propertyLabel");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
