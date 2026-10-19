"use server";

import { revalidatePath } from "next/cache";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const roleByLabel: Record<string, UserRole> = {
  "Super Admin": UserRole.SUPER_ADMIN,
  Admin: UserRole.ADMIN,
  "LGA Chairman": UserRole.LGA_CHAIRMAN,
  "Property Owner": UserRole.PROPERTY_OWNER,
};

const statusByLabel: Record<string, UserStatus> = {
  Active: UserStatus.ACTIVE,
  Invited: UserStatus.INVITED,
};

export type CreateUserResult =
  | { ok: true }
  | {
      ok: false;
      field: "name" | "email" | "password" | "role" | "lga" | "status";
      message: string;
    };

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  lgaId: string;
}): Promise<CreateUserResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const role = roleByLabel[input.role];

  if (!name) return { ok: false, field: "name", message: "Enter a name." };
  if (!email) return { ok: false, field: "email", message: "Enter an email." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: "email", message: "Enter a valid email." };
  }
  if (!password) {
    return { ok: false, field: "password", message: "Enter a password." };
  }
  if (password.length > 6) {
    return {
      ok: false,
      field: "password",
      message: "Password must be at most 6 characters.",
    };
  }
  if (!role) return { ok: false, field: "role", message: "Choose a role." };
  const membership = await membershipLgaId(role, input.lgaId);
  if (!membership.ok) return membership;

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role,
        status: "INVITED",
        lgaId: membership.lgaId,
      },
    });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return {
        ok: false,
        field: "email",
        message: "A user with this email already exists.",
      };
    }
    throw error;
  }

  revalidatePath("/super-admin/users");
  return { ok: true };
}

export async function updateUser(input: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  lgaId: string;
}): Promise<CreateUserResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const role = roleByLabel[input.role];
  const status = statusByLabel[input.status];

  if (!name) return { ok: false, field: "name", message: "Enter a name." };
  if (!email) return { ok: false, field: "email", message: "Enter an email." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: "email", message: "Enter a valid email." };
  }
  if (password && password.length < 8) {
    return {
      ok: false,
      field: "password",
      message: "Password must be at least 8 characters.",
    };
  }
  if (!role) return { ok: false, field: "role", message: "Choose a role." };
  if (!status) {
    return { ok: false, field: "status", message: "Choose a status." };
  }
  const membership = await membershipLgaId(role, input.lgaId);
  if (!membership.ok) return membership;

  try {
    await prisma.user.update({
      where: { id: input.id },
      data: {
        name,
        email,
        role,
        status,
        lgaId: membership.lgaId,
        ...(password ? { passwordHash: await hashPassword(password) } : {}),
      },
    });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return {
        ok: false,
        field: "email",
        message: "A user with this email already exists.",
      };
    }
    if (isMissingRecord(error)) {
      return {
        ok: false,
        field: "email",
        message: "This user is no longer on the list.",
      };
    }
    throw error;
  }

  revalidatePath("/super-admin/users");
  return { ok: true };
}

export async function deleteUser(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (isMissingRecord(error)) {
      return { ok: false, message: "This user is no longer on the list." };
    }
    throw error;
  }

  revalidatePath("/super-admin/users");
  return { ok: true };
}

async function membershipLgaId(role: UserRole, lgaId: string) {
  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    return { ok: true as const, lgaId: null };
  }
  if (!lgaId) {
    return { ok: false as const, field: "lga" as const, message: "Choose an LGA." };
  }
  const lga = await prisma.lga.findUnique({
    where: { id: lgaId },
    select: { id: true },
  });
  if (!lga) {
    return { ok: false as const, field: "lga" as const, message: "Choose an LGA." };
  }
  return { ok: true as const, lgaId: lga.id };
}

function isUniqueConstraint(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isMissingRecord(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
