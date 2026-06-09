import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Configurações"
        title="Preferências visuais"
        description="Tela estática para validar como ajustes básicos podem aparecer no produto."
      />

      <section className="max-w-3xl rounded-lg border border-line bg-panel p-5 shadow-soft">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">Nome da base</span>
            <input
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              defaultValue="StudyBase"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">Area inicial</span>
            <select
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
              <span className="block text-sm font-semibold text-slate-900">Abrir favoritos primeiro</span>
              <span className="block text-sm text-slate-600">Preferência visual para uma futura experiência personalizada.</span>
            </span>
            <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500" />
          </label>

          <button type="button" className="h-11 w-fit rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">
            Salvar preferências
          </button>
        </div>
      </section>
    </div>
  );
}
