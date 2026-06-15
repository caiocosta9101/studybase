import { AnotacoesListClient } from "@/components/anotacoes/anotacoes-list-client";
import { PageHeader } from "@/components/page-header";
import { getNotesForList } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getNotesForList();

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Anotações"
        title="Biblioteca de conhecimento"
        description="Consulte conteúdos por busca, área, categoria, tags, tipos e favoritos."
      />

      <AnotacoesListClient initialNotes={notes} />
    </div>
  );
}
