"use client";

import Link from "next/link";
import { NoteTypeBadge } from "@/components/note-type-badge";
import { useNotes } from "@/context/notes-context";

type NoteDetailsViewProps = {
  id: string;
};

export function NoteDetailsView({ id }: NoteDetailsViewProps) {
  const {
    clearCreatedNoteFeedback,
    clearFavoriteFeedback,
    createdNoteId,
    favoriteFeedback,
    getNoteById,
    toggleFavorite
  } = useNotes();
  const note = getNoteById(id);

  if (!note) {
    return (
      <section className="mx-auto max-w-3xl rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Anotação não encontrada</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Essa anotação não existe nos dados mockados ou foi criada em uma sessão que já foi recarregada.
        </p>
        <Link
          href="/anotacoes"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Voltar para anotações
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/anotacoes" className="text-sm font-bold text-sky-700 hover:text-sky-900">
          Voltar para anotações
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(note.id)}
          className={
            note.isFavorite
              ? "w-fit rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
              : "w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          }
        >
          {note.isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
        </button>
      </div>

      {createdNoteId === note.id ? (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-emerald-800">
            Anotação criada com sucesso. Ela está disponível nesta sessão local.
          </p>
          <button
            type="button"
            onClick={clearCreatedNoteFeedback}
            className="w-fit rounded-lg border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Fechar
          </button>
        </div>
      ) : null}

      {favoriteFeedback ? (
        <div className="flex flex-col gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-sky-800">{favoriteFeedback}</p>
          <button
            type="button"
            onClick={clearFavoriteFeedback}
            className="w-fit rounded-lg border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
          >
            Fechar
          </button>
        </div>
      ) : null}

      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <NoteTypeBadge type={note.type} />
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
            {note.area}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
            {note.category}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{note.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{note.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200/70">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Conteúdo</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{note.content}</p>

          {note.comparison ? (
            <div className="mt-7 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-bold text-slate-950">Comparação</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {note.comparison.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="font-bold text-slate-950">{item.label}</h4>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {note.code ? (
            <pre className="mt-7 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{note.code}</code>
            </pre>
          ) : null}

          {note.solution ? (
            <div className="mt-7 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-bold text-emerald-950">Solução aplicada</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-900">{note.solution}</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Resumo rápido</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Atualizado</dt>
                <dd className="font-bold text-slate-800">{note.updatedAt}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Leitura</dt>
                <dd className="font-bold text-slate-800">{note.readingTime}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Tipo</dt>
                <dd className="font-bold text-slate-800">{note.typeLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Pontos-chave</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {note.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </article>
  );
}
