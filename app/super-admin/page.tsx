import { AdminDashboard } from "@/components/admin/dashboard";

export const metadata = {
  title: "Officer desk — Expert LGA",
  description:
    "Review housing applications, the property register, tenancies, and allocation sittings.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
