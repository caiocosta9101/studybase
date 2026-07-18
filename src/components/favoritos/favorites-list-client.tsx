"use client";

import { useState } from "react";
import { NoteCard } from "@/components/note-card";
import type { Note } from "@/types/note";

type FavoritesListClientProps = {
  initialNotes: Note[];
};

export function FavoritesListClient({ initialNotes }: FavoritesListClientProps) {
  const [favoriteNotes, setFavoriteNotes] = useState(initialNotes);
  const [favoriteFeedback, setFavoriteFeedback] = useState<string | null>(null);

  function removeFavorite(id: string) {
    const note = favoriteNotes.find((item) => item.id === id);

    if (!note) {
      return;
    }

    setFavoriteFeedback(`"${note.title}" foi removida dos favoritos nesta visualização.`);
    setFavoriteNotes((currentNotes) => currentNotes.filter((item) => item.id !== id));
  }

  return (
    <>
      {favoriteFeedback ? (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-emerald-800">{favoriteFeedback}</p>
          <button
            type="button"
            onClick={() => setFavoriteFeedback(null)}
            className="w-fit rounded-lg border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Fechar
          </button>
        </div>
      ) : null}

      {favoriteNotes.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {favoriteNotes.map((note) => (
            <NoteCard key={note.id} note={note} onToggleFavorite={removeFavorite} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-slate-950">Nenhum favorito por enquanto</h2>
          <p className="mt-2 text-sm text-slate-600">Marque anotações como favoritas para vê-las aqui.</p>
        </section>
      )}
    </>
  );
}
