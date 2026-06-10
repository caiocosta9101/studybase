"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function TagsPage() {
  const router = useRouter();
  const { resetFilters, setTag, tagSummaries } = useNotes();

  function openTag(tag: string) {
    resetFilters();
    setTag(tag);
    router.push("/anotacoes");
  }

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Tags"
        title="Marcadores da base"
        description="Use marcadores para conectar assuntos e encontrar conteúdos com mais rapidez."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">Tags em uso</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Marcadores organizados para leitura rápida da base.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tagSummaries.map((tag) => (
            <button
              key={tag.name}
              type="button"
              onClick={() => openTag(tag.name)}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
              {tag.name} <span className="text-slate-400">{tag.count}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
