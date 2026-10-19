import { BoardPage } from "@/components/admin/dashboard";

export const metadata = {
  title: "Allocation board — Expert LGA",
  description: "Sittings scheduled from the current waiting list.",
};

export default function Page() {
  return <BoardPage />;
}
