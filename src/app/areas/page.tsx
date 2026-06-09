import { PageHeader } from "@/components/page-header";
import { areas } from "@/data/mock-notes";

export default function AreasPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Áreas"
        title="Organização por assunto"
        description="Agrupe anotações de estudos, trabalho, saúde, finanças e qualquer outro contexto."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <div key={area.name} className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">{area.name}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {area.count} itens
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{area.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
