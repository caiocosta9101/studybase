import { NoteType } from "@/types/note";

export const noteTypeConfig: Record<NoteType, { label: string; className: string }> = {
  SIMPLE: {
    label: "Anotação simples",
    className: "border-sky-200 bg-sky-50 text-sky-700"
  },
  GUIDE: {
    label: "Guia",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  COMPARISON: {
    label: "Comparação",
    className: "border-violet-200 bg-violet-50 text-violet-700"
  },
  SNIPPET: {
    label: "Snippet",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  ERROR_SOLUTION: {
    label: "Erro e solução",
    className: "border-rose-200 bg-rose-50 text-rose-700"
  }
};
