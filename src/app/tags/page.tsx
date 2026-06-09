import { PageHeader } from "@/components/page-header";
import { tags } from "@/data/mock-notes";

export default function TagsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tags"
        title="Marcadores da base"
        description="Tags estáticas para demonstrar como os conteúdos podem ser encontrados por palavras-chave."
      />

      <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {tag} <span className="text-slate-400">{(index % 5) + 1}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
