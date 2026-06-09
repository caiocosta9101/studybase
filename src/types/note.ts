export type NoteType = "SIMPLE" | "GUIDE" | "COMPARISON" | "SNIPPET" | "ERROR_SOLUTION";

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
  code?: string;
  solution?: string;
};
