import { TenantShell } from "@/components/tenant/shell";

export default function TenantLayout({
  children,
}: LayoutProps<"/tenant">) {
  return <TenantShell>{children}</TenantShell>;
}
