"use client";

import { FilterBar } from "@/components/filter-bar";
import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { useNotes } from "@/context/notes-context";

export default function NotesPage() {
  const {
    areas,
    categories,
    filteredNotes,
    filters,
    notes,
    resetFilters,
    setArea,
    setCategory,
    setSearchTerm,
    setShowFavoritesOnly,
    setTag,
    setType,
    tags,
    toggleFavorite
  } = useNotes();

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Anotações"
        title="Biblioteca de conhecimento"
        description="Consulte conteúdos por busca, área, categoria, tags, tipos e favoritos."
      />

      <FilterBar
        searchTerm={filters.searchTerm}
        selectedArea={filters.area}
        selectedCategory={filters.category}
        selectedType={filters.type}
        selectedTag={filters.tag}
        areas={areas}
        categories={categories}
        tags={tags}
        onSearchTermChange={setSearchTerm}
        onAreaChange={setArea}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        onTagChange={setTag}
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
              onClick={() => setShowFavoritesOnly(false)}
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
              onClick={() => setShowFavoritesOnly(true)}
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
          </div>
        )}
      </section>
    </div>
  );
}
