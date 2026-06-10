"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/styles";

const navigation = [
  { label: "Dashboard", href: "/dashboard", mark: "D" },
  { label: "Anotações", href: "/anotacoes", mark: "A" },
  { label: "Nova anotação", href: "/anotacoes/nova", mark: "+" },
  { label: "Favoritos", href: "/favoritos", mark: "F" },
  { label: "Áreas", href: "/areas", mark: "Ar" },
  { label: "Tags", href: "/tags", mark: "T" },
  { label: "Configurações", href: "/configuracoes", mark: "C" }
];

function isActive(pathname: string, href: string) {
  if (href === "/anotacoes") {
    return pathname === href || (pathname.startsWith("/anotacoes/") && pathname !== "/anotacoes/nova");
  }

  return pathname === href;
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-white/95 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 p-4 lg:p-5">
        <Link href="/" className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-white">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-soft">
            SB
          </span>
          <span>
            <span className="block text-lg font-bold leading-6 text-slate-950">StudyBase</span>
            <span className="block text-sm leading-5 text-slate-600">Base pessoal de conhecimento</span>
          </span>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Menu principal">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-slate-950 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold",
                    active ? "bg-white text-slate-950" : "bg-white text-slate-500 ring-1 ring-slate-200"
                  )}
                >
                  {item.mark}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-lg border border-slate-200 bg-slate-50 p-4 lg:block">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">Sua base</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
              Organizada
            </span>
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-600">Conteúdos separados por área, categoria, tipo e tags.</p>
        </div>
      </div>
    </aside>
  );
}
