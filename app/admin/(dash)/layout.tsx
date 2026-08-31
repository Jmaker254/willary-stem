import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser("VIEWER");

  return (
    <div className="admin">
      <AdminNav role={user.role} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ fontSize: "0.85rem", color: "var(--body)" }}>
            Signed in as <strong>{user.name}</strong> · {user.role}
          </div>
          <LogoutButton />
        </div>
        {children}
      </div>
    </div>
  );
}
