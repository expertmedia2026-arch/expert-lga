import { TenanciesPage } from "@/components/admin/dashboard";

export const metadata = {
  title: "Tenancies — Expert LGA",
  description: "Council rents and arrears currently on the ledger.",
};

export default function Page() {
  return <TenanciesPage />;
}
