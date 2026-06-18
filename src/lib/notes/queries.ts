import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapNoteDetailsToUiNote, mapNoteListItemToUiNote } from "./mappers";

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

const noteDetailsSelect = {
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
  },
  comparison: {
    select: {
      problem: true,
      conclusion: true,
      options: {
        orderBy: {
          order: "asc"
        },
        select: {
          title: true,
          description: true,
          whenUse: true,
          advantages: true,
          disadvantages: true,
          attentionPoints: true,
          example: true
        }
      }
    }
  },
  snippets: {
    select: {
      language: true,
      code: true,
      explanation: true
    }
  }
} satisfies Prisma.NoteSelect;

export type NoteListItem = Prisma.NoteGetPayload<{
  select: typeof noteListItemSelect;
}>;

export type NoteDetailsItem = Prisma.NoteGetPayload<{
  select: typeof noteDetailsSelect;
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

export async function getNoteBySlug(slug: string) {
  const note = await prisma.note.findUnique({
    where: {
      slug
    },
    select: noteDetailsSelect
  });

  return note ? mapNoteDetailsToUiNote(note) : null;
}
