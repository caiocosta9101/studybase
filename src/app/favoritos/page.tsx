"use client";

import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function FavoritesPage() {
  const { clearFavoriteFeedback, favoriteFeedback, favoriteNotes, toggleFavorite } = useNotes();

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Favoritos"
        title="Conteúdos importantes"
        description="Acesse rapidamente as anotações mais importantes da sua base."
      />

      <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4">
        <p className="text-sm font-bold text-rose-900">Prioridade de consulta</p>
        <p className="mt-1 text-sm leading-6 text-rose-800">
          Favoritos ajudam a destacar conteúdos que precisam ficar sempre fáceis de encontrar.
        </p>
      </div>

      {favoriteFeedback ? (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-emerald-800">{favoriteFeedback}</p>
          <button
            type="button"
            onClick={clearFavoriteFeedback}
            className="w-fit rounded-lg border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Fechar
          </button>
        </div>
      ) : null}

      {favoriteNotes.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {favoriteNotes.map((note) => (
            <NoteCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-slate-950">Nenhum favorito por enquanto</h2>
          <p className="mt-2 text-sm text-slate-600">Marque anotações como favoritas para vê-las aqui.</p>
        </section>
      )}
    </div>
  );
}
