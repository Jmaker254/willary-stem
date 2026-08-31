import type { ReactNode } from "react";
import Announce from "@/components/site/Announce";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings } from "@/lib/content";

// Content is DB-driven and editable from the admin — always render fresh.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSettings();
  return (
    <>
      <Announce settings={settings} />
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
