import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { requireCurrentUser } from "@/lib/auth/session";
import { getAreaSummaries } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function AreasPage() {
  const currentUser = await requireCurrentUser();
  const areas = await getAreaSummaries(currentUser.id);

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Áreas"
        title="Organização por assunto"
        description="Agrupe anotações de estudos, trabalho, saúde, finanças e qualquer outro contexto."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <div key={area.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sky-200">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-950">{area.name}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                {area.count} itens
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{area.description}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.min(area.count * 18, 90)}%` }} />
            </div>
            <Link
              href={`/anotacoes?area=${encodeURIComponent(area.slug)}`}
              className="mt-5 inline-flex h-10 items-center rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Ver anotações
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
