import { noteTypeConfig } from "@/config/note-type-config";
import { Note } from "@/types/note";
import type { NoteListItem } from "./queries";

export function mapNoteListItemToUiNote(note: NoteListItem): Note {
  const content = note.content ?? "";
  const description = note.summary?.trim() || createDescriptionFromContent(content);

  return {
    id: note.slug,
    title: note.title,
    description,
    content,
    type: note.type,
    typeLabel: noteTypeConfig[note.type].label,
    area: note.area.name,
    category: note.category.name,
    tags: note.noteTags.map((noteTag) => noteTag.tag.name),
    isFavorite: note.favorite,
    updatedAt: formatDate(note.updatedAt),
    readingTime: estimateReadingTime(content),
    highlights: buildHighlights(note.area.name, note.category.name, note.type)
  };
}

function createDescriptionFromContent(content: string) {
  const normalizedContent = content.trim().replace(/\s+/g, " ");

  if (!normalizedContent) {
    return "Sem resumo cadastrado.";
  }

  return normalizedContent.length > 160 ? `${normalizedContent.slice(0, 157)}...` : normalizedContent;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));

  return `${minutes} min`;
}

function buildHighlights(area: string, category: string, type: Note["type"]) {
  return [`Área: ${area}`, `Categoria: ${category}`, `Tipo: ${noteTypeConfig[type].label}`];
}
