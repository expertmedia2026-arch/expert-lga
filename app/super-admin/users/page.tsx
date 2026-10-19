import { UsersPage, type UserRow } from "@/components/admin/users-page";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Users — Expert LGA",
  description: "Officers, tenants, and property owners on the housing portal.",
};

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  LGA_CHAIRMAN: "LGA Chairman",
  PROPERTY_OWNER: "Property Owner",
};

const statusLabel: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INVITED: "Invited",
};

export default async function AdminUsersPage() {
  const [records, lgas] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { lga: { select: { code: true } } },
    }),
    prisma.lga.findMany({
      orderBy: [{ state: "asc" }, { name: "asc" }],
      select: { id: true, name: true, state: true, code: true },
    }),
  ]);

  const users: UserRow[] = records.map((record) => ({
    id: record.id,
    name: record.name,
    email: record.email,
    role: roleLabel[record.role],
    status: statusLabel[record.status],
    lgaId: record.lgaId,
    lgaCode: record.lga?.code ?? null,
  }));

  return <UsersPage users={users} lgas={lgas} />;
}
