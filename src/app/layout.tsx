import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
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
      <body className="min-h-screen bg-slate-50 antialiased">
        <div className="min-h-screen lg:flex">
          <AppSidebar />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
