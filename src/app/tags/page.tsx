import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { requireCurrentUser } from "@/lib/auth/session";
import { getTagSummaries } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const currentUser = await requireCurrentUser();
  const tagSummaries = await getTagSummaries(currentUser.id);

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Tags"
        title="Marcadores da base"
        description="Use marcadores para conectar assuntos e encontrar conteúdos com mais rapidez."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">Tags em uso</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Marcadores organizados para leitura rápida da base.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tagSummaries.map((tag) => (
            <Link
              key={tag.slug}
              href={`/anotacoes?tag=${encodeURIComponent(tag.slug)}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
              {tag.name} <span className="text-slate-400">{tag.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
