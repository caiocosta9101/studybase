"use client";

import { useCallback, useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { NoteCard } from "@/components/note-card";
import { Note, NoteType } from "@/types/note";

type AnotacoesListClientProps = {
  initialNotes: Note[];
};

type NoteFilters = {
  searchTerm: string;
  area: string;
  category: string;
  type: NoteType | "ALL";
  tag: string;
  showFavoritesOnly: boolean;
};

const initialFilters: NoteFilters = {
  searchTerm: "",
  area: "Todas",
  category: "Todas",
  type: "ALL",
  tag: "Todas",
  showFavoritesOnly: false
};

export function AnotacoesListClient({ initialNotes }: AnotacoesListClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filters, setFilters] = useState<NoteFilters>(initialFilters);
  const [favoriteFeedback, setFavoriteFeedback] = useState<string | null>(null);

  const areas = useMemo(() => ["Todas", ...uniqueValues(notes.map((note) => note.area))], [notes]);
  const categories = useMemo(() => ["Todas", ...uniqueValues(notes.map((note) => note.category))], [notes]);
  const tags = useMemo(() => ["Todas", ...uniqueValues(notes.flatMap((note) => note.tags))], [notes]);

  const filteredNotes = useMemo(() => {
    const searchTerm = normalizeText(filters.searchTerm);

    return notes.filter((note) => {
      const matchesSearch =
        !searchTerm ||
        normalizeText([
          note.title,
          note.description,
          note.content,
          note.area,
          note.category,
          note.typeLabel,
          ...note.tags
        ].join(" ")).includes(searchTerm);

      const matchesArea = filters.area === "Todas" || note.area === filters.area;
      const matchesCategory = filters.category === "Todas" || note.category === filters.category;
      const matchesType = filters.type === "ALL" || note.type === filters.type;
      const matchesTag = filters.tag === "Todas" || note.tags.includes(filters.tag);
      const matchesFavorite = !filters.showFavoritesOnly || note.isFavorite;

      return matchesSearch && matchesArea && matchesCategory && matchesType && matchesTag && matchesFavorite;
    });
  }, [filters, notes]);

  const toggleFavorite = useCallback((id: string) => {
    const targetNote = notes.find((note) => note.id === id);

    if (!targetNote) {
      return;
    }

    setFavoriteFeedback(
      targetNote.isFavorite
        ? `"${targetNote.title}" foi removida dos favoritos nesta visualização.`
        : `"${targetNote.title}" foi marcada como favorita nesta visualização.`
    );

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              isFavorite: !note.isFavorite
            }
          : note
      )
    );
  }, [notes]);

  function resetFilters() {
    setFilters(initialFilters);
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

      <FilterBar
        searchTerm={filters.searchTerm}
        selectedArea={filters.area}
        selectedCategory={filters.category}
        selectedType={filters.type}
        selectedTag={filters.tag}
        showFavoritesOnly={filters.showFavoritesOnly}
        areas={areas}
        categories={categories}
        tags={tags}
        onSearchTermChange={(value) => setFilters((current) => ({ ...current, searchTerm: value }))}
        onAreaChange={(value) => setFilters((current) => ({ ...current, area: value }))}
        onCategoryChange={(value) => setFilters((current) => ({ ...current, category: value }))}
        onTypeChange={(value) => setFilters((current) => ({ ...current, type: value }))}
        onTagChange={(value) => setFilters((current) => ({ ...current, tag: value }))}
        onReset={resetFilters}
      />

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Todas as anotações</h2>
            <p className="mt-1 text-sm text-slate-600">
              {filteredNotes.length} de {notes.length} anotações encontradas.
            </p>
          </div>
          <div className="flex gap-2 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setFilters((current) => ({ ...current, showFavoritesOnly: false }))}
              className={
                filters.showFavoritesOnly
                  ? "rounded-full border border-slate-200 bg-white px-3 py-1.5"
                  : "rounded-full bg-slate-950 px-3 py-1.5 text-white"
              }
            >
              Recentes
            </button>
            <button
              type="button"
              onClick={() => setFilters((current) => ({ ...current, showFavoritesOnly: true }))}
              className={
                filters.showFavoritesOnly
                  ? "rounded-full bg-slate-950 px-3 py-1.5 text-white"
                  : "rounded-full border border-slate-200 bg-white px-3 py-1.5"
              }
            >
              Favoritos
            </button>
          </div>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-lg font-bold text-slate-950">Nenhuma anotação encontrada</h3>
            <p className="mt-2 text-sm text-slate-600">Ajuste a busca ou limpe os filtros para ver mais resultados.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 h-10 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
