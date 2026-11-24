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
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
