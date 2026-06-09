import Link from "next/link";
import { Note } from "@/types/note";
import { NoteTypeBadge } from "./note-type-badge";

type NoteCardProps = {
  note: Note;
  compact?: boolean;
};

export function NoteCard({ note, compact = false }: NoteCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-panel p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300">
      <div className="flex flex-wrap items-center gap-2">
        <NoteTypeBadge type={note.type} />
        {note.isFavorite ? (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            Favorito
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex-1">
        <Link href={`/anotacoes/${note.id}`} className="text-lg font-semibold text-slate-950 hover:text-sky-700">
          {note.title}
        </Link>
        <p className="mt-2 text-sm leading-6 text-slate-600">{note.description}</p>
      </div>

      {!compact ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <span>{note.area}</span>
        <span>{note.updatedAt}</span>
      </div>
    </article>
  );
}
