import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import AppShell from "@/app/components/AppShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-background-color ${plusJakartaSans.variable}`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}