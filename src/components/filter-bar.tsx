type FilterBarProps = {
  categories: string[];
  tags: string[];
};

const areas = ["Todas", "Programação", "Inglês", "Saúde", "Projetos", "Finanças"];
const types = ["Todos", "Simples", "Guia", "Comparação", "Snippet", "Erro"];

export function FilterBar({ categories, tags }: FilterBarProps) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Buscar por palavra-chave</span>
        <input
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          placeholder="Ex: axios, take your time, prisma, gastos..."
        />
      </label>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <FilterGroup label="Áreas" items={areas} active="Todas" />
        <FilterGroup label="Categorias" items={categories} active={categories[0]} />
        <FilterGroup label="Tipos" items={types} active="Todos" />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-800">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, items, active }: { label: string; items: string[]; active: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-800">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={
              item === active
                ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white"
                : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
