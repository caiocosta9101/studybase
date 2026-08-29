import Link from "next/link";
import { AnotacoesListClient } from "@/components/anotacoes/anotacoes-list-client";
import { PageHeader } from "@/components/page-header";
import { requireCurrentUser } from "@/lib/auth/session";
import { getAreaNameBySlug, getNotesForList, getTagNameBySlug } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

type NotesPageProps = {
  searchParams: Promise<{
    area?: string | string[];
    tag?: string | string[];
    status?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const currentUser = await requireCurrentUser();
  const [notes, params] = await Promise.all([getNotesForList(currentUser.id), searchParams]);
  const areaSlug = typeof params.area === "string" ? params.area : undefined;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;
  const showDeletionFeedback = params.status === "note_deleted";
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

      {showDeletionFeedback ? (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm font-semibold text-emerald-800">A anotação foi excluída permanentemente.</p>
          <Link
            href="/anotacoes"
            className="w-fit rounded-lg border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Fechar
          </Link>
        </div>
      ) : null}

      <AnotacoesListClient
        key={`${initialArea ?? "all-areas"}:${initialTag ?? "all-tags"}`}
        initialNotes={notes}
        initialArea={initialArea}
        initialTag={initialTag}
      />
    </div>
  );
}
