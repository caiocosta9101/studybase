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
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
        <Link href="/" className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
          <span className="block text-xl font-bold text-slate-950">StudyBase</span>
          <span className="mt-1 block text-sm leading-5 text-slate-600">Organize o que você aprende.</span>
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
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold",
                    active ? "bg-white text-slate-950" : "bg-slate-100 text-slate-600"
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
          <p className="text-sm font-semibold text-slate-950">Fase 1</p>
          <p className="mt-1 text-sm leading-5 text-slate-600">Base visual estática com dados mockados.</p>
        </div>
      </div>
    </aside>
  );
}
