import { TenantDashboard } from "@/components/tenant/dashboard";

export const metadata = {
  title: "Tenant desk — Expert LGA",
  description:
    "Your tenancy, rent standing, and notices from the local government housing desk.",
};

export default function TenantPage() {
  return <TenantDashboard />;
}
