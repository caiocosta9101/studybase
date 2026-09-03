"use client";

import { useState } from "react";
import { NoteCard } from "@/components/note-card";
import { useNoteFavoriteMutation } from "@/hooks/use-note-favorite-mutation";
import type { Note } from "@/types/note";

type FavoritesListClientProps = {
  initialNotes: Note[];
};

export function FavoritesListClient({ initialNotes }: FavoritesListClientProps) {
  const [favoriteNotes, setFavoriteNotes] = useState(initialNotes);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const { setFavorite, isFavoritePending } = useNoteFavoriteMutation();

  async function removeFavorite(slug: string) {
    setFavoriteError(null);

    const result = await setFavorite(slug, false);

    if (!result) {
      return;
    }

    if (!result.success) {
      setFavoriteError(result.message);
      return;
    }

    if (!result.favorite) {
      setFavoriteNotes((currentNotes) => currentNotes.filter((item) => item.id !== slug));
    }
  }

  return (
    <>
      {favoriteError ? (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {favoriteError}
        </p>
      ) : null}

      {favoriteNotes.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {favoriteNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onFavoriteChange={(slug) => removeFavorite(slug)}
              isFavoritePending={isFavoritePending(note.id)}
            />
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
