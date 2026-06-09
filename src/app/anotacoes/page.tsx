import { FilterBar } from "@/components/filter-bar";
import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { categories, mockNotes, tags } from "@/data/mock-notes";

export default function NotesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Anotações"
        title="Biblioteca de conhecimento"
        description="Listagem estática com busca visual, filtros por área, categoria, tags, tipos e favoritos."
      />

      <FilterBar categories={categories.slice(0, 6)} tags={tags.slice(0, 8)} />

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Todas as anotações</h2>
            <p className="mt-1 text-sm text-slate-600">{mockNotes.length} exemplos mockados para a Fase 1.</p>
          </div>
          <div className="flex gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Recentes</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Favoritos</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {mockNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </section>
    </div>
  );
}
