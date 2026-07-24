import { AnotacoesListClient } from "@/components/anotacoes/anotacoes-list-client";
import { PageHeader } from "@/components/page-header";
import { getAreaNameBySlug, getNotesForList } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

type NotesPageProps = {
  searchParams: Promise<{
    area?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const [notes, params] = await Promise.all([getNotesForList(), searchParams]);
  const areaSlug = typeof params.area === "string" ? params.area : undefined;
  const initialArea = areaSlug ? await getAreaNameBySlug(areaSlug) : undefined;

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Anotações"
        title="Biblioteca de conhecimento"
        description="Consulte conteúdos por busca, área, categoria, tags, tipos e favoritos."
      />

      <AnotacoesListClient key={initialArea ?? "all-areas"} initialNotes={notes} initialArea={initialArea} />
    </div>
  );
}
