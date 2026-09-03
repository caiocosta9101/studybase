"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteNoteAction } from "@/app/anotacoes/[id]/actions";
import { NoteTypeBadge } from "@/components/note-type-badge";
import { useNoteFavoriteMutation } from "@/hooks/use-note-favorite-mutation";
import { Note } from "@/types/note";

type NoteDetailsViewProps = {
  note: Note;
};

const basicNoteTypes = new Set<Note["type"]>(["SIMPLE", "GUIDE", "ERROR_SOLUTION"]);

export function NoteDetailsView({ note }: NoteDetailsViewProps) {
  const router = useRouter();
  const deletionInProgress = useRef(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { setFavorite, isFavoritePending } = useNoteFavoriteMutation();
  const canManage = basicNoteTypes.has(note.type);
  const favoritePending = isFavoritePending(note.id);

  async function changeFavorite() {
    setFavoriteError(null);

    const result = await setFavorite(note.id, !isFavorite);

    if (!result) {
      return;
    }

    if (!result.success) {
      setFavoriteError(result.message);
      return;
    }

    setIsFavorite(result.favorite);
  }

  function openDeleteConfirmation() {
    setDeleteError(null);
    setIsDeleteConfirmationOpen(true);
  }

  function cancelDelete() {
    if (isDeleting) {
      return;
    }

    setDeleteError(null);
    setIsDeleteConfirmationOpen(false);
  }

  async function confirmDelete() {
    if (deletionInProgress.current) {
      return;
    }

    deletionInProgress.current = true;
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteNoteAction(note.id).catch((error) => {
      deletionInProgress.current = false;
      setIsDeleting(false);
      throw error;
    });

    if (result.success) {
      router.replace("/anotacoes?status=note_deleted");
      return;
    }

    setDeleteError(result.message);
    deletionInProgress.current = false;
    setIsDeleting(false);
  }

  return (
    <article className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/anotacoes" className="text-sm font-bold text-sky-700 hover:text-sky-900">
          Voltar para anotações
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {canManage ? (
            <Link
              href={`/anotacoes/${encodeURIComponent(note.id)}/editar`}
              aria-disabled={isDeleting}
              className={`w-fit rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 transition hover:bg-sky-100 ${
                isDeleting ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Editar
            </Link>
          ) : null}
          {canManage ? (
            <button
              type="button"
              disabled={isDeleting}
              onClick={openDeleteConfirmation}
              className="w-fit rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Excluir
            </button>
          ) : null}
          <button
            type="button"
            disabled={isDeleting || favoritePending}
            onClick={changeFavorite}
            className={
              isFavorite
                ? "w-fit rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                : "w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            }
            aria-busy={favoritePending}
          >
            {favoritePending ? "Salvando…" : isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
          </button>
        </div>
      </div>

      {canManage && isDeleteConfirmationOpen ? (
        <section
          aria-busy={isDeleting}
          aria-labelledby="delete-note-title"
          aria-describedby="delete-note-description"
          className="rounded-lg border border-rose-200 bg-rose-50 p-5 shadow-soft"
        >
          <h2 id="delete-note-title" className="text-base font-bold text-rose-950">
            Excluir esta anotação?
          </h2>
          <p id="delete-note-description" className="mt-2 text-sm leading-6 text-rose-900">
            A exclusão de “{note.title}” é permanente e não poderá ser desfeita.
          </p>

          {deleteError ? (
            <p role="alert" className="mt-3 text-sm font-semibold text-rose-800">
              {deleteError}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={cancelDelete}
              className="h-10 rounded-lg border border-rose-200 bg-white px-4 text-sm font-bold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="h-10 rounded-lg bg-rose-700 px-4 text-sm font-bold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-rose-400"
            >
              {isDeleting ? "Excluindo…" : "Excluir permanentemente"}
            </button>
          </div>
        </section>
      ) : null}

      {favoriteError ? (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {favoriteError}
        </p>
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
