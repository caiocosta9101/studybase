"use client";

import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function HomePage() {
  const { areas, categories, favoriteNotes, notes, toggleFavorite } = useNotes();
  const recentNotes = notes.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Base pessoal"
        title="StudyBase"
        description="Organize aprendizados de qualquer assunto por área, categoria, tags, tipo de anotação e favoritos."
        action={
          <Link
            href="/anotacoes/nova"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
          >
            Nova anotação
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Anotações salvas" value={String(notes.length)} helper="Conhecimentos prontos para consulta" tone="sky" />
        <MetricCard label="Áreas ativas" value={String(areas.length - 1)} helper={`${categories.length - 1} categorias organizadas`} tone="emerald" />
        <MetricCard label="Favoritos" value={String(favoriteNotes.length)} helper="Conteúdos importantes em destaque" tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Fluxo principal</h2>
              <p className="mt-1 text-sm text-slate-600">
                A primeira versão mostra como a base pode ser consultada antes de existir persistência real.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Ver dashboard
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Busca por palavra-chave",
              "Filtros por área e categoria",
              "Tipos: guia, snippet e comparação",
              "Favoritos e tags visíveis"
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Atalhos</h2>
          <div className="mt-4 grid gap-3">
            <Link
              href="/anotacoes"
              className="rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50"
            >
              Consultar anotações
            </Link>
            <Link
              href="/favoritos"
              className="rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-800 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Ver favoritos
            </Link>
            <Link
              href="/areas"
              className="rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Navegar por áreas
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Exemplos recentes</h2>
            <p className="mt-1 text-sm text-slate-600">Conteúdos variados para mostrar como a base pode ser organizada.</p>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {recentNotes.map((note) => (
            <NoteCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </section>
    </div>
  );
}
