"use client";

import Link from "next/link";
import { Note } from "@/types/note";
import { NoteTypeBadge } from "./note-type-badge";

type NoteCardProps = {
  note: Note;
  compact?: boolean;
  onToggleFavorite?: (id: string) => void;
};

export function NoteCard({ note, compact = false, onToggleFavorite }: NoteCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <NoteTypeBadge type={note.type} />
          {note.isFavorite ? (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              Favorito
            </span>
          ) : null}
        </div>

        {onToggleFavorite ? (
          <button
            type="button"
            onClick={() => onToggleFavorite(note.id)}
            className={
              note.isFavorite
                ? "rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            }
            aria-label={note.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {note.isFavorite ? "Remover" : "Favoritar"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex-1">
        <Link href={`/anotacoes/${note.id}`} className="text-lg font-bold leading-7 text-slate-950 transition group-hover:text-sky-700">
          {note.title}
        </Link>
        <p className="mt-2 text-sm leading-6 text-slate-600">{note.description}</p>
      </div>

      {!compact ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/70">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <span className="text-slate-700">{note.area}</span>
        <span>{note.updatedAt}</span>
      </div>
    </article>
  );
}
