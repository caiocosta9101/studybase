"use client";

import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { NoteCard } from "@/components/note-card";
import { NoteTypeBadge } from "@/components/note-type-badge";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function DashboardPage() {
  const { areaSummaries, categories, favoriteNotes, notes, noteTypeSummary, tags, toggleFavorite } = useNotes();
  const visibleFavoriteNotes = favoriteNotes.slice(0, 3);

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Dashboard"
        title="Visão geral da sua base"
        description="Acompanhe os conteúdos salvos, favoritos, tipos de anotação e áreas mais usadas."
        action={
          <Link
            href="/anotacoes/nova"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800"
          >
            Nova anotação
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total de anotações" value={String(notes.length)} helper="Dados locais da sessão" tone="sky" />
        <MetricCard label="Categorias" value={String(categories.length - 1)} helper="Técnicas e pessoais" tone="emerald" />
        <MetricCard label="Tags" value={String(tags.length - 1)} helper="Organização rápida" tone="amber" />
        <MetricCard label="Favoritos" value={String(favoriteNotes.length)} helper="Conteúdos essenciais" tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Anotações favoritas</h2>
              <p className="mt-1 text-sm text-slate-600">Itens importantes para consultar primeiro.</p>
            </div>
            <Link href="/favoritos" className="text-sm font-bold text-sky-700 hover:text-sky-900">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {visibleFavoriteNotes.map((note) => (
              <NoteCard key={note.id} note={note} compact onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Tipos de anotação</h2>
            <p className="mt-1 text-sm text-slate-600">Distribuição dos formatos salvos na base.</p>
          </div>
          <div className="mt-5 space-y-4">
            {noteTypeSummary.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <NoteTypeBadge type={item.type} />
                  <span className="text-sm font-bold text-slate-700">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-950" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Áreas mais usadas</h2>
            <p className="mt-1 text-sm text-slate-600">Uma leitura rápida de como os conteúdos estão distribuídos.</p>
          </div>
          <Link href="/areas" className="text-sm font-bold text-sky-700 hover:text-sky-900">
            Gerenciar áreas
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areaSummaries.map((area) => (
            <div key={area.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{area.name}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                  {area.count}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
