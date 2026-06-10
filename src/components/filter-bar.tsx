import { NoteType } from "@/types/note";

type FilterBarProps = {
  searchTerm: string;
  selectedArea: string;
  selectedCategory: string;
  selectedType: NoteType | "ALL";
  selectedTag: string;
  areas: string[];
  categories: string[];
  tags: string[];
  onSearchTermChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: NoteType | "ALL") => void;
  onTagChange: (value: string) => void;
  onReset: () => void;
};

const types: Array<{ label: string; value: NoteType | "ALL" }> = [
  { label: "Todos", value: "ALL" },
  { label: "Simples", value: "SIMPLE" },
  { label: "Guia", value: "GUIDE" },
  { label: "Comparação", value: "COMPARISON" },
  { label: "Snippet", value: "SNIPPET" },
  { label: "Erro", value: "ERROR_SOLUTION" }
];

export function FilterBar({
  searchTerm,
  selectedArea,
  selectedCategory,
  selectedType,
  selectedTag,
  areas,
  categories,
  tags,
  onSearchTermChange,
  onAreaChange,
  onCategoryChange,
  onTypeChange,
  onTagChange,
  onReset
}: FilterBarProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="grid flex-1 gap-2">
          <span className="text-sm font-semibold text-slate-900">Buscar por palavra-chave</span>
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="Ex: axios, take your time, prisma, gastos..."
          />
        </label>

        <button
          type="button"
          onClick={onReset}
          className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Limpar filtros
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <FilterGroup label="Áreas" items={areas} active={selectedArea} onChange={onAreaChange} />
        <FilterGroup label="Categorias" items={categories} active={selectedCategory} onChange={onCategoryChange} />
        <TypeFilterGroup active={selectedType} onChange={onTypeChange} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-800">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange(tag)}
              className={
                tag === selectedTag
                  ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                  : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  items,
  active,
  onChange
}: {
  label: string;
  items: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-900">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={
              item === active
                ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeFilterGroup({
  active,
  onChange
}: {
  active: NoteType | "ALL";
  onChange: (value: NoteType | "ALL") => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-900">Tipos</p>
      <div className="flex flex-wrap gap-2">
        {types.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={
              item.value === active
                ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
