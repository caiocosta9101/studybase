import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { mockNotes } from "@/data/mock-notes";

const favorites = mockNotes.filter((note) => note.isFavorite);

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Favoritos"
        title="Conteúdos importantes"
        description="Tela visual com anotações marcadas para consulta rápida."
      />

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {favorites.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </section>
    </div>
  );
}
