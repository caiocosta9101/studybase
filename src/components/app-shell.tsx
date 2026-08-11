"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { NotesProvider } from "@/context/notes-context";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/cadastro";

  if (isAuthPage) {
    return <NotesProvider>{children}</NotesProvider>;
  }

  return (
    <NotesProvider>
      <div className="min-h-screen lg:flex">
        <AppSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-72 lg:px-10 lg:py-10">{children}</main>
      </div>
    </NotesProvider>
  );
}
