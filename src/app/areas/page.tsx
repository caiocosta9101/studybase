"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function AreasPage() {
  const router = useRouter();
  const { areaSummaries, resetFilters, setArea } = useNotes();

  function openArea(area: string) {
    resetFilters();
    setArea(area);
    router.push("/anotacoes");
  }

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Áreas"
        title="Organização por assunto"
        description="Agrupe anotações de estudos, trabalho, saúde, finanças e qualquer outro contexto."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areaSummaries.map((area) => (
          <div key={area.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sky-200">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-950">{area.name}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                {area.count} itens
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{area.description}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.min(area.count * 18, 90)}%` }} />
            </div>
            <button
              type="button"
              onClick={() => openArea(area.name)}
              className="mt-5 h-10 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Ver anotações
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
