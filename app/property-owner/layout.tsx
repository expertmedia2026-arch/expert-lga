import { OwnerShell } from "@/components/owner/shell";

export default function OwnerLayout({
  children,
}: LayoutProps<"/property-owner">) {
  return <OwnerShell>{children}</OwnerShell>;
}
