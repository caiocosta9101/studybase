import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { NoteCard } from "@/components/note-card";
import { NoteTypeBadge } from "@/components/note-type-badge";
import { PageHeader } from "@/components/page-header";
import { areas, mockNotes, noteTypeSummary } from "@/data/mock-notes";

const favoriteNotes = mockNotes.filter((note) => note.isFavorite).slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Visão geral da sua base"
        description="Resumo estático para validar indicadores, cards e organização por contexto."
        action={
          <Link
            href="/anotacoes/nova"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
          >
            Nova anotação
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total de anotações" value="128" helper="+12 neste mês" tone="sky" />
        <MetricCard label="Categorias" value="24" helper="Técnicas e pessoais" tone="emerald" />
        <MetricCard label="Tags" value="76" helper="Organização rápida" tone="amber" />
        <MetricCard label="Favoritos" value="18" helper="Conteúdos essenciais" tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Anotações favoritas</h2>
              <p className="mt-1 text-sm text-slate-600">Itens importantes para consultar primeiro.</p>
            </div>
            <Link href="/favoritos" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {favoriteNotes.map((note) => (
              <NoteCard key={note.id} note={note} compact />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Tipos de anotação</h2>
          <div className="mt-5 space-y-4">
            {noteTypeSummary.map((item) => (
              <div key={item.type} className="flex items-center justify-between gap-4">
                <NoteTypeBadge type={item.type} />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: item.width }} />
                </div>
                <span className="w-8 text-right text-sm font-semibold text-slate-700">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Áreas mais usadas</h2>
            <p className="mt-1 text-sm text-slate-600">Uma leitura rápida de como os conteúdos estão distribuídos.</p>
          </div>
          <Link href="/areas" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            Gerenciar áreas
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <div key={area.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{area.name}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  {area.count}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
