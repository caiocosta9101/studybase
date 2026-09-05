import { noteTypeConfig } from "@/config/note-type-config";
import { Note, NoteSnippet } from "@/types/note";
import type { NoteDetailsItem, NoteListItem } from "./queries";

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

export function mapNoteDetailsToUiNote(note: NoteDetailsItem): Note {
  const content = note.content ?? "";
  const description = note.summary?.trim() || createDescriptionFromContent(content);
  const comparison = mapComparison(note);
  const snippet = mapSnippet(note);

  const uiNote: Note = {
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

  if (comparison) {
    uiNote.comparison = comparison;
  }

  if (snippet) {
    uiNote.snippet = snippet;
  }

  return uiNote;
}

function mapSnippet(note: NoteDetailsItem): NoteSnippet | undefined {
  if (note.type !== "SNIPPET") {
    return undefined;
  }

  if (note.comparison) {
    return {
      status: "inconsistent",
      reason: "incompatible"
    };
  }

  if (note.snippets.length === 0) {
    return {
      status: "inconsistent",
      reason: "missing"
    };
  }

  if (note.snippets.length > 1) {
    return {
      status: "inconsistent",
      reason: "multiple"
    };
  }

  const [snippet] = note.snippets;

  if (!snippet.language.trim() || !snippet.code.trim()) {
    return {
      status: "inconsistent",
      reason: "invalid-fields"
    };
  }

  return {
    status: "valid",
    language: snippet.language,
    code: snippet.code,
    explanation: snippet.explanation?.trim() ? snippet.explanation : null
  };
}

function mapComparison(note: NoteDetailsItem) {
  if (!note.comparison) {
    return undefined;
  }

  const options = note.comparison.options.map((option) => ({
    label: option.title,
    points: [
      option.description,
      option.whenUse ? `Quando usar: ${option.whenUse}` : null,
      option.advantages ? `Vantagens: ${option.advantages}` : null,
      option.disadvantages ? `Limites: ${option.disadvantages}` : null,
      option.attentionPoints ? `Atenção: ${option.attentionPoints}` : null,
      option.example ? `Exemplo: ${option.example}` : null
    ].filter((point): point is string => Boolean(point))
  }));

  return options.length > 0 ? options : undefined;
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
