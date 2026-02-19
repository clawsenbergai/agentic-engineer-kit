import { Geist } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
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
      <body className={`${geist.variable} font-[family-name:var(--font-geist)] antialiased`}>
        <div className="flex min-h-screen">
          <AppSidebar tracks={tracks} overallScore={summary.overallScore} />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-5xl px-6 py-6">
              {children}
            </div>
          </main>
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
