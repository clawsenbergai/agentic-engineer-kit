import { Geist } from "next/font/google";
import "./globals.css";

import { DashboardShell } from "@/components/dashboard-shell";
import { getDashboardSummary, getTracks } from "@/lib/repository";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "Learning Dashboard",
  description: "Evidence-driven agentic engineer learning dashboard",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const [tracks, summary] = await Promise.all([getTracks(), getDashboardSummary()]);

  return (
    <html lang="en">
      <body className={`${geist.variable} app-body`}>
        <DashboardShell tracks={tracks} overallScore={summary.overallScore}>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
