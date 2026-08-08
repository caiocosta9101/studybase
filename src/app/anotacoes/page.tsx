import { AnotacoesListClient } from "@/components/anotacoes/anotacoes-list-client";
import { PageHeader } from "@/components/page-header";
import { requireCurrentUser } from "@/lib/auth/session";
import { getAreaNameBySlug, getNotesForList, getTagNameBySlug } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

type NotesPageProps = {
  searchParams: Promise<{
    area?: string | string[];
    tag?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const currentUser = await requireCurrentUser();
  const [notes, params] = await Promise.all([getNotesForList(currentUser.id), searchParams]);
  const areaSlug = typeof params.area === "string" ? params.area : undefined;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;
  const [initialArea, initialTag] = await Promise.all([
    areaSlug ? getAreaNameBySlug(areaSlug, currentUser.id) : undefined,
    tagSlug ? getTagNameBySlug(tagSlug, currentUser.id) : undefined
  ]);

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Anotações"
        title="Biblioteca de conhecimento"
        description="Consulte conteúdos por busca, área, categoria, tags, tipos e favoritos."
      />

      <AnotacoesListClient
        key={`${initialArea ?? "all-areas"}:${initialTag ?? "all-tags"}`}
        initialNotes={notes}
        initialArea={initialArea}
        initialTag={initialTag}
      />
    </div>
  );
}
