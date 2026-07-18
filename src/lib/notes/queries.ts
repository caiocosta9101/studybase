import { Prisma } from "@prisma/client";
import { noteTypeConfig } from "@/config/note-type-config";
import { prisma } from "@/lib/prisma";
import { mapNoteDetailsToUiNote, mapNoteListItemToUiNote } from "./mappers";
import type { Note, NoteType } from "@/types/note";

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

export type DashboardData = {
  totalNotes: number;
  usedCategories: number;
  usedTags: number;
  totalFavorites: number;
  favoriteNotes: Note[];
  noteTypeSummary: Array<{
    type: NoteType;
    count: number;
    width: string;
  }>;
  areaSummaries: Array<{
    name: string;
    description: string;
    count: number;
  }>;
};

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

export async function getDashboardData(): Promise<DashboardData> {
  const [totalNotes, usedCategories, usedTags, totalFavorites, favoriteNotes, typeCounts, areas] = await Promise.all([
    prisma.note.count(),
    prisma.category.count({
      where: {
        notes: {
          some: {}
        }
      }
    }),
    prisma.tag.count({
      where: {
        noteTags: {
          some: {}
        }
      }
    }),
    prisma.note.count({
      where: {
        favorite: true
      }
    }),
    prisma.note.findMany({
      where: {
        favorite: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 3,
      select: noteListItemSelect
    }),
    prisma.note.groupBy({
      by: ["type"],
      _count: {
        _all: true
      }
    }),
    prisma.area.findMany({
      select: {
        name: true,
        description: true,
        _count: {
          select: {
            notes: true
          }
        }
      }
    })
  ]);

  const typeCountByType = new Map(typeCounts.map((item) => [item.type, item._count._all]));

  return {
    totalNotes,
    usedCategories,
    usedTags,
    totalFavorites,
    favoriteNotes: favoriteNotes.map(mapNoteListItemToUiNote),
    noteTypeSummary: (Object.keys(noteTypeConfig) as NoteType[]).map((type) => {
      const count = typeCountByType.get(type) ?? 0;
      const width = totalNotes > 0 ? Math.max(Math.round((count / totalNotes) * 100), count > 0 ? 12 : 0) : 0;

      return {
        type,
        count,
        width: `${width}%`
      };
    }),
    areaSummaries: areas
      .filter((area) => area._count.notes > 0)
      .sort((firstArea, secondArea) => secondArea._count.notes - firstArea._count.notes)
      .map((area) => ({
        name: area.name,
        description: area.description ?? `Anotações organizadas na área ${area.name}.`,
        count: area._count.notes
      }))
  };
}
