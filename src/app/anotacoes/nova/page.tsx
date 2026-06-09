import { PageHeader } from "@/components/page-header";
import { areas, categories, tags } from "@/data/mock-notes";

const noteTypes = ["Anotação simples", "Guia", "Comparação", "Snippet", "Erro e solução"];

export default function NewNotePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Nova anotação"
        title="Registrar aprendizado"
        description="Formulário estático para validar campos principais antes de existir salvamento real."
      />

      <form className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-800">Titulo</span>
              <input
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Ex: Fetch vs Axios"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-800">Resumo</span>
              <textarea
                className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Escreva uma descrição curta para encontrar essa anotação depois."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-800">Conteudo</span>
              <textarea
                className="min-h-64 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Registre conceito, explicação, passos, exemplo prático, erro ou solução."
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <h2 className="text-base font-semibold text-slate-950">Organização</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-800">Tipo</span>
                <select className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {noteTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-800">Área</span>
                <select className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {areas.map((area) => (
                    <option key={area.name}>{area.name}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-800">Categoria</span>
                <select className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <h2 className="text-base font-semibold text-slate-950">Tags sugeridas</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-slate-900">Marcar como favorito</span>
                <span className="block text-sm text-slate-600">Destaca a anotação nas consultas principais.</span>
              </span>
              <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500" />
            </label>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Salvar anotação
              </button>
              <button
                type="button"
                className="h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
