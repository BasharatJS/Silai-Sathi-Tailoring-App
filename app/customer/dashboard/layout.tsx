import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard - Silai Sathi",
  description: "Manage your orders and preferences",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
