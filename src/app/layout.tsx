import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyBase",
  description: "Base pessoal de conhecimento para organizar o que você aprende."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f6f8fb] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
