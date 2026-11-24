import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "NEET Intelligence Platform | Youth Transition & Intervention Research",
  description: "An AI-Powered Framework for Youth NEET Prediction, Transition Analysis, Opportunity Discovery and Evidence-Based Intervention in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" id="app-root">
      <body className="bg-[var(--bg-base)] text-[var(--text-main)] font-sans antialiased min-h-screen selection:bg-[#d4653940] selection:text-[#f4f2eb]">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
