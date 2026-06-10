import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Configurações"
        title="Preferências visuais"
        description="Defina preferências básicas para deixar a base alinhada com sua rotina."
      />

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-950">Ajustes da base</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Personalize informações gerais e preferências iniciais da sua base.</p>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Nome da base</span>
            <input
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              defaultValue="StudyBase"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Área inicial</span>
            <select
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              defaultValue="Geral"
            >
              <option>Geral</option>
              <option>Programação</option>
              <option>Inglês</option>
              <option>Finanças</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span>
              <span className="block text-sm font-bold text-slate-900">Abrir favoritos primeiro</span>
              <span className="block text-sm text-slate-600">Mantém os conteúdos importantes mais próximos no fluxo de consulta.</span>
            </span>
            <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500" />
          </label>

          <button type="button" className="h-11 w-fit rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800">
            Salvar preferências
          </button>
        </div>
      </section>
    </div>
  );
}
