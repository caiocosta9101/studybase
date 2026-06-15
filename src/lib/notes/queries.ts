import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapNoteListItemToUiNote } from "./mappers";

const noteListItemSelect = {
  slug: true,
  title: true,
  summary: true,
  content: true,
  type: true,
  favorite: true,
  updatedAt: true,
  area: {
    select: {
      name: true
    }
  },
  category: {
    select: {
      name: true
    }
  },
  noteTags: {
    select: {
      tag: {
        select: {
          name: true
        }
      }
    }
  }
} satisfies Prisma.NoteSelect;

export type NoteListItem = Prisma.NoteGetPayload<{
  select: typeof noteListItemSelect;
}>;

export async function getNotesForList() {
  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc"
    },
    select: noteListItemSelect
  });

  return notes.map(mapNoteListItemToUiNote);
}
