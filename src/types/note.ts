export type NoteType = "SIMPLE" | "GUIDE" | "COMPARISON" | "SNIPPET" | "ERROR_SOLUTION";

export type NoteSnippet =
  | {
      status: "valid";
      language: string;
      code: string;
      explanation: string | null;
    }
  | {
      status: "inconsistent";
      reason: "missing" | "multiple" | "incompatible" | "invalid-fields";
    };

export type Note = {
  id: string;
  title: string;
  description: string;
  content: string;
  type: NoteType;
  typeLabel: string;
  area: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  updatedAt: string;
  readingTime: string;
  highlights: string[];
  comparison?: Array<{
    label: string;
    points: string[];
  }>;
  snippet?: NoteSnippet;
  solution?: string;
};
