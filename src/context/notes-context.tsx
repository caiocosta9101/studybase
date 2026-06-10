"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { areas as initialAreas, mockNotes, noteTypeConfig } from "@/data/mock-notes";
import { Note, NoteType } from "@/types/note";

type NoteFilters = {
  searchTerm: string;
  area: string;
  category: string;
  type: NoteType | "ALL";
  tag: string;
  showFavoritesOnly: boolean;
};

type CreateNoteInput = {
  title: string;
  description: string;
  content: string;
  type: NoteType;
  area: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
};

type AreaSummary = {
  name: string;
  count: number;
  description: string;
};

type TagSummary = {
  name: string;
  count: number;
};

type NoteTypeSummary = {
  type: NoteType;
  count: number;
  width: string;
};

type NotesContextValue = {
  notes: Note[];
  filteredNotes: Note[];
  favoriteNotes: Note[];
  createdNoteId: string | null;
  favoriteFeedback: string | null;
  filters: NoteFilters;
  areas: string[];
  categories: string[];
  tags: string[];
  areaSummaries: AreaSummary[];
  tagSummaries: TagSummary[];
  noteTypeSummary: NoteTypeSummary[];
  setSearchTerm: (value: string) => void;
  setArea: (value: string) => void;
  setCategory: (value: string) => void;
  setType: (value: NoteType | "ALL") => void;
  setTag: (value: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
  resetFilters: () => void;
  toggleFavorite: (id: string) => void;
  addNote: (input: CreateNoteInput) => Note;
  getNoteById: (id: string) => Note | undefined;
  clearCreatedNoteFeedback: () => void;
  clearFavoriteFeedback: () => void;
};

const initialFilters: NoteFilters = {
  searchTerm: "",
  area: "Todas",
  category: "Todas",
  type: "ALL",
  tag: "Todas",
  showFavoritesOnly: false
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [filters, setFilters] = useState<NoteFilters>(initialFilters);
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);
  const [favoriteFeedback, setFavoriteFeedback] = useState<string | null>(null);

  const favoriteNotes = useMemo(() => notes.filter((note) => note.isFavorite), [notes]);

  const areas = useMemo(() => ["Todas", ...uniqueValues(notes.map((note) => note.area))], [notes]);
  const categories = useMemo(() => ["Todas", ...uniqueValues(notes.map((note) => note.category))], [notes]);
  const tags = useMemo(() => ["Todas", ...uniqueValues(notes.flatMap((note) => note.tags))], [notes]);

  const filteredNotes = useMemo(() => {
    const searchTerm = normalizeText(filters.searchTerm);

    return notes.filter((note) => {
      const matchesSearch =
        !searchTerm ||
        normalizeText([
          note.title,
          note.description,
          note.content,
          note.area,
          note.category,
          note.typeLabel,
          ...note.tags
        ].join(" ")).includes(searchTerm);

      const matchesArea = filters.area === "Todas" || note.area === filters.area;
      const matchesCategory = filters.category === "Todas" || note.category === filters.category;
      const matchesType = filters.type === "ALL" || note.type === filters.type;
      const matchesTag = filters.tag === "Todas" || note.tags.includes(filters.tag);
      const matchesFavorite = !filters.showFavoritesOnly || note.isFavorite;

      return matchesSearch && matchesArea && matchesCategory && matchesType && matchesTag && matchesFavorite;
    });
  }, [filters, notes]);

  const areaSummaries = useMemo(() => {
    return uniqueValues(notes.map((note) => note.area)).map((area) => {
      const initialArea = initialAreas.find((item) => item.name === area);

      return {
        name: area,
        count: notes.filter((note) => note.area === area).length,
        description: initialArea?.description ?? `Anotações organizadas na área ${area}.`
      };
    });
  }, [notes]);

  const tagSummaries = useMemo(() => {
    return uniqueValues(notes.flatMap((note) => note.tags)).map((tag) => ({
      name: tag,
      count: notes.filter((note) => note.tags.includes(tag)).length
    }));
  }, [notes]);

  const noteTypeSummary = useMemo(() => {
    const total = Math.max(notes.length, 1);

    return (Object.keys(noteTypeConfig) as NoteType[]).map((type) => {
      const count = notes.filter((note) => note.type === type).length;
      const percentage = Math.max(Math.round((count / total) * 100), count > 0 ? 12 : 0);

      return {
        type,
        count,
        width: `${percentage}%`
      };
    });
  }, [notes]);

  const toggleFavorite = useCallback((id: string) => {
    const targetNote = notes.find((note) => note.id === id);

    if (targetNote) {
      setFavoriteFeedback(
        targetNote.isFavorite
          ? `"${targetNote.title}" foi removida dos favoritos.`
          : `"${targetNote.title}" foi adicionada aos favoritos.`
      );
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) => (note.id === id ? { ...note, isFavorite: !note.isFavorite } : note))
    );
  }, [notes]);

  const addNote = useCallback((input: CreateNoteInput) => {
    const note: Note = {
      id: createNoteId(input.title),
      title: input.title.trim(),
      description: input.description.trim(),
      content: input.content.trim(),
      type: input.type,
      typeLabel: noteTypeConfig[input.type].label,
      area: input.area,
      category: input.category,
      tags: input.tags,
      isFavorite: input.isFavorite,
      updatedAt: "Agora",
      readingTime: estimateReadingTime(input.content),
      highlights: buildHighlights(input)
    };

    setNotes((currentNotes) => [note, ...currentNotes]);
    setCreatedNoteId(note.id);
    return note;
  }, []);

  const getNoteById = useCallback((id: string) => notes.find((note) => note.id === id), [notes]);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      filteredNotes,
      favoriteNotes,
      createdNoteId,
      favoriteFeedback,
      filters,
      areas,
      categories,
      tags,
      areaSummaries,
      tagSummaries,
      noteTypeSummary,
      setSearchTerm: (value) => setFilters((current) => ({ ...current, searchTerm: value })),
      setArea: (value) => setFilters((current) => ({ ...current, area: value })),
      setCategory: (value) => setFilters((current) => ({ ...current, category: value })),
      setType: (value) => setFilters((current) => ({ ...current, type: value })),
      setTag: (value) => setFilters((current) => ({ ...current, tag: value })),
      setShowFavoritesOnly: (value) => setFilters((current) => ({ ...current, showFavoritesOnly: value })),
      resetFilters: () => setFilters(initialFilters),
      toggleFavorite,
      addNote,
      getNoteById,
      clearCreatedNoteFeedback: () => setCreatedNoteId(null),
      clearFavoriteFeedback: () => setFavoriteFeedback(null)
    }),
    [
      notes,
      filteredNotes,
      favoriteNotes,
      createdNoteId,
      favoriteFeedback,
      filters,
      areas,
      categories,
      tags,
      areaSummaries,
      tagSummaries,
      noteTypeSummary,
      toggleFavorite,
      addNote,
      getNoteById
    ]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes deve ser usado dentro de NotesProvider.");
  }

  return context;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createNoteId(title: string) {
  const base = normalizeText(title)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base || "anotacao"}-${Date.now()}`;
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));

  return `${minutes} min`;
}

function buildHighlights(input: CreateNoteInput) {
  return [
    `Área: ${input.area}`,
    `Categoria: ${input.category}`,
    `Tipo: ${noteTypeConfig[input.type].label}`
  ];
}
