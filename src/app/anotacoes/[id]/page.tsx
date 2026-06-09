import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteTypeBadge } from "@/components/note-type-badge";
import { mockNotes } from "@/data/mock-notes";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return mockNotes.map((note) => ({
    id: note.id
  }));
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;
  const note = mockNotes.find((item) => item.id === id);

  if (!note) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/anotacoes" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
          Voltar para anotações
        </Link>
        {note.isFavorite ? (
          <span className="w-fit rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Favorito
          </span>
        ) : null}
      </div>

      <header className="rounded-lg border border-line bg-panel p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <NoteTypeBadge type={note.type} />
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            {note.area}
          </span>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            {note.category}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-bold text-slate-950">{note.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{note.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-line bg-panel p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Conteudo</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{note.content}</p>

          {note.comparison ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {note.comparison.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-950">{item.label}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {item.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {note.code ? (
            <pre className="mt-6 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{note.code}</code>
            </pre>
          ) : null}

          {note.solution ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-950">Solucao aplicada</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-900">{note.solution}</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <h2 className="text-base font-semibold text-slate-950">Resumo rapido</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Atualizado</dt>
                <dd className="font-semibold text-slate-800">{note.updatedAt}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Leitura</dt>
                <dd className="font-semibold text-slate-800">{note.readingTime}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Tipo</dt>
                <dd className="font-semibold text-slate-800">{note.typeLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
            <h2 className="text-base font-semibold text-slate-950">Pontos-chave</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {note.highlights.map((highlight) => (
                <li key={highlight}>- {highlight}</li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </article>
  );
}
