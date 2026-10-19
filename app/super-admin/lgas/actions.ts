"use server";

import { revalidatePath } from "next/cache";
import { nigeriaLgas } from "@/components/admin/nigeria-lgas";
import { LgaStatus } from "@/generated/prisma/enums";
import { isLgaId } from "@/lib/lga-id";
import { prisma } from "@/lib/prisma";

const statusByLabel: Record<string, LgaStatus> = {
  Onboarding: LgaStatus.ONBOARDING,
  Active: LgaStatus.ACTIVE,
};

export type CreateLgaResult =
  | { ok: true }
  | {
      ok: false;
      field: "name" | "state" | "chairman" | "code" | "status";
      message: string;
    };

export async function createLga(input: {
  name: string;
  state: string;
  chairman: string;
  code: string;
}): Promise<CreateLgaResult> {
  const name = input.name.trim();
  const state = input.state.trim();
  const chairman = input.chairman.trim();
  const code = input.code.trim().toUpperCase();
  const localGovernments =
    state in nigeriaLgas ? nigeriaLgas[state as keyof typeof nigeriaLgas] : [];

  if (!state) return { ok: false, field: "state", message: "Choose a state." };
  if (!name) {
    return { ok: false, field: "name", message: "Choose a local government." };
  }
  if (!localGovernments.includes(name as (typeof localGovernments)[number])) {
    return {
      ok: false,
      field: "name",
      message: "Choose a local government in the selected state.",
    };
  }
  if (!chairman) {
    return { ok: false, field: "chairman", message: "Enter a chairman." };
  }
  if (!isLgaId(code)) {
    return {
      ok: false,
      field: "code",
      message: "LGA ID is missing. Close and open Add LGA again.",
    };
  }

  try {
    await prisma.lga.create({
      data: {
        code,
        name,
        state,
        chairmanName: chairman,
        status: "ONBOARDING",
      },
    });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      const fields = uniqueFields(error);
      if (fields.some((field) => field.toLowerCase().includes("code"))) {
        return {
          ok: false,
          field: "code",
          message: "This LGA ID is already in use. Close and open Add LGA again.",
        };
      }
      return {
        ok: false,
        field: "name",
        message: "This LGA is already on the list.",
      };
    }
    throw error;
  }

  revalidatePath("/super-admin/lgas");
  revalidatePath("/super-admin/users");
  return { ok: true };
}

export async function updateLga(input: {
  id: string;
  name: string;
  state: string;
  chairman: string;
  status: string;
}): Promise<CreateLgaResult> {
  const name = input.name.trim();
  const state = input.state.trim();
  const chairman = input.chairman.trim();
  const status = statusByLabel[input.status];
  const localGovernments =
    state in nigeriaLgas ? nigeriaLgas[state as keyof typeof nigeriaLgas] : [];

  if (!state) return { ok: false, field: "state", message: "Choose a state." };
  if (!name) {
    return { ok: false, field: "name", message: "Choose a local government." };
  }
  if (!localGovernments.includes(name as (typeof localGovernments)[number])) {
    return {
      ok: false,
      field: "name",
      message: "Choose a local government in the selected state.",
    };
  }
  if (!chairman) {
    return { ok: false, field: "chairman", message: "Enter a chairman." };
  }
  if (!status) {
    return { ok: false, field: "status", message: "Choose a status." };
  }

  try {
    await prisma.lga.update({
      where: { id: input.id },
      data: {
        name,
        state,
        chairmanName: chairman,
        chairmanId: null,
        status,
      },
    });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return {
        ok: false,
        field: "name",
        message: "This LGA is already on the list.",
      };
    }
    if (isMissingRecord(error)) {
      return {
        ok: false,
        field: "name",
        message: "This LGA is no longer on the list.",
      };
    }
    throw error;
  }

  revalidatePath("/super-admin/lgas");
  revalidatePath("/super-admin/users");
  return { ok: true };
}

export async function deleteLga(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await prisma.lga.delete({ where: { id } });
  } catch (error) {
    if (isMissingRecord(error)) {
      return { ok: false, message: "This LGA is no longer on the list." };
    }
    throw error;
  }

  revalidatePath("/super-admin/lgas");
  revalidatePath("/super-admin/users");
  return { ok: true };
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

function uniqueFields(error: unknown) {
  if (typeof error !== "object" || error === null || !("meta" in error)) {
    return [];
  }
  const target = (error as { meta?: { target?: unknown } }).meta?.target;
  if (Array.isArray(target)) return target.map(String);
  if (typeof target === "string") return [target];
  return [];
}
