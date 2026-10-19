import { LgasPage, type LgaRow } from "@/components/admin/lgas-page";
import { LgaStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "LGAs — Expert LGA",
  description: "Local government areas on the housing portal.",
};

const statusLabel: Record<LgaStatus, string> = {
  ACTIVE: "Active",
  ONBOARDING: "Onboarding",
};

export default async function Page() {
  const records = await prisma.lga.findMany({
    orderBy: [{ state: "asc" }, { name: "asc" }],
    include: {
      chairman: {
        select: { name: true },
      },
    },
  });

  const lgas: LgaRow[] = records.map((record) => ({
    id: record.id,
    code: record.code,
    name: record.name,
    state: record.state,
    chairman: record.chairman?.name ?? record.chairmanName ?? "—",
    status: statusLabel[record.status],
  }));

  return <LgasPage lgas={lgas} />;
}
