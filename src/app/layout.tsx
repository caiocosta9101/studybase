import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { NotesProvider } from "@/context/notes-context";
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
        <NotesProvider>
          <div className="min-h-screen lg:flex">
            <AppSidebar />
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-72 lg:px-10 lg:py-10">
              {children}
            </main>
          </div>
        </NotesProvider>
      </body>
    </html>
  );
}
