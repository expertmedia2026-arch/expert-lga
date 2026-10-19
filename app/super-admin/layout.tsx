import { AdminShell } from "@/components/admin/shell";

export default function AdminLayout({ children }: LayoutProps<"/super-admin">) {
  return <AdminShell>{children}</AdminShell>;
}
