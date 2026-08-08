import { FavoritesListClient } from "@/components/favoritos/favorites-list-client";
import { PageHeader } from "@/components/page-header";
import { requireCurrentUser } from "@/lib/auth/session";
import { getFavoriteNotes } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const currentUser = await requireCurrentUser();
  const favoriteNotes = await getFavoriteNotes(currentUser.id);

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

      <FavoritesListClient initialNotes={favoriteNotes} />
    </div>
  );
}
