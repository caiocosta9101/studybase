import "server-only";

import { NoteType as PrismaNoteType, Prisma } from "@prisma/client";
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

const editableNoteSelect = {
  slug: true,
  title: true,
  summary: true,
  content: true,
  type: true,
  favorite: true,
  areaId: true,
  categoryId: true,
  noteTags: {
    select: {
      tagId: true
    }
  }
} satisfies Prisma.NoteSelect;

const editableNoteTypes: PrismaNoteType[] = [
  PrismaNoteType.SIMPLE,
  PrismaNoteType.GUIDE,
  PrismaNoteType.ERROR_SOLUTION
];

export type NoteListItem = Prisma.NoteGetPayload<{
  select: typeof noteListItemSelect;
}>;

export type NoteDetailsItem = Prisma.NoteGetPayload<{
  select: typeof noteDetailsSelect;
}>;

type EditableNoteItem = Prisma.NoteGetPayload<{
  select: typeof editableNoteSelect;
}>;

export type EditableNoteData = Omit<EditableNoteItem, "noteTags"> & {
  tagIds: string[];
};

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

export type AreaSummary = {
  name: string;
  slug: string;
  description: string;
  count: number;
};

export type TagSummary = {
  name: string;
  slug: string;
  count: number;
};

export type HomeData = {
  totalNotes: number;
  usedAreas: number;
  usedCategories: number;
  totalFavorites: number;
  recentNotes: Note[];
};

export type NoteCreationCatalog = {
  areas: Array<{
    id: string;
    name: string;
    categories: Array<{
      id: string;
      name: string;
    }>;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
};

export async function getNoteCreationCatalog(): Promise<NoteCreationCatalog> {
  const [areas, tags] = await Promise.all([
    prisma.area.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        categories: {
          orderBy: {
            name: "asc"
          },
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.tag.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true
      }
    })
  ]);

  return {
    areas,
    tags
  };
}

export async function getEditableNoteBySlug(slug: string, userId: string): Promise<EditableNoteData | null> {
  const note = await prisma.note.findFirst({
    where: {
      slug,
      userId,
      type: {
        in: editableNoteTypes
      }
    },
    select: editableNoteSelect
  });

  if (!note) {
    return null;
  }

  const { noteTags, ...editableNote } = note;

  return {
    ...editableNote,
    tagIds: noteTags.map((noteTag) => noteTag.tagId)
  };
}

export async function getNotesForList(userId: string) {
  const notes = await prisma.note.findMany({
    where: {
      userId
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: noteListItemSelect
  });

  return notes.map(mapNoteListItemToUiNote);
}

export async function getFavoriteNotes(userId: string) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
      favorite: true
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: noteListItemSelect
  });

  return notes.map(mapNoteListItemToUiNote);
}

export async function getHomeData(userId: string): Promise<HomeData> {
  const [totalNotes, usedAreas, usedCategories, totalFavorites, recentNotes] = await Promise.all([
    prisma.note.count({
      where: {
        userId
      }
    }),
    prisma.area.count({
      where: {
        notes: {
          some: {
            userId
          }
        }
      }
    }),
    prisma.category.count({
      where: {
        notes: {
          some: {
            userId
          }
        }
      }
    }),
    prisma.note.count({
      where: {
        userId,
        favorite: true
      }
    }),
    prisma.note.findMany({
      where: {
        userId
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 3,
      select: noteListItemSelect
    })
  ]);

  return {
    totalNotes,
    usedAreas,
    usedCategories,
    totalFavorites,
    recentNotes: recentNotes.map(mapNoteListItemToUiNote)
  };
}

export async function getAreaSummaries(userId: string): Promise<AreaSummary[]> {
  const areas = await prisma.area.findMany({
    where: {
      notes: {
        some: {
          userId
        }
      }
    },
    orderBy: {
      name: "asc"
    },
    select: {
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          notes: {
            where: {
              userId
            }
          }
        }
      }
    }
  });

  return areas.map((area) => ({
    name: area.name,
    slug: area.slug,
    description: area.description ?? `Anotações organizadas na área ${area.name}.`,
    count: area._count.notes
  }));
}

export async function getAreaNameBySlug(slug: string, userId: string) {
  const area = await prisma.area.findFirst({
    where: {
      slug,
      notes: {
        some: {
          userId
        }
      }
    },
    select: {
      name: true
    }
  });

  return area?.name;
}

export async function getTagSummaries(userId: string): Promise<TagSummary[]> {
  const tags = await prisma.tag.findMany({
    where: {
      noteTags: {
        some: {
          note: {
            userId
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    },
    select: {
      name: true,
      slug: true,
      _count: {
        select: {
          noteTags: {
            where: {
              note: {
                userId
              }
            }
          }
        }
      }
    }
  });

  return tags.map((tag) => ({
    name: tag.name,
    slug: tag.slug,
    count: tag._count.noteTags
  }));
}

export async function getTagNameBySlug(slug: string, userId: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      slug,
      noteTags: {
        some: {
          note: {
            userId
          }
        }
      }
    },
    select: {
      name: true
    }
  });

  return tag?.name;
}

export async function getNoteBySlug(slug: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: {
      slug,
      userId
    },
    select: noteDetailsSelect
  });

  return note ? mapNoteDetailsToUiNote(note) : null;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [totalNotes, usedCategories, usedTags, totalFavorites, favoriteNotes, typeCounts, areas] = await Promise.all([
    prisma.note.count({
      where: {
        userId
      }
    }),
    prisma.category.count({
      where: {
        notes: {
          some: {
            userId
          }
        }
      }
    }),
    prisma.tag.count({
      where: {
        noteTags: {
          some: {
            note: {
              userId
            }
          }
        }
      }
    }),
    prisma.note.count({
      where: {
        userId,
        favorite: true
      }
    }),
    prisma.note.findMany({
      where: {
        userId,
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
      where: {
        userId
      },
      _count: {
        _all: true
      }
    }),
    prisma.area.findMany({
      where: {
        notes: {
          some: {
            userId
          }
        }
      },
      select: {
        name: true,
        description: true,
        _count: {
          select: {
            notes: {
              where: {
                userId
              }
            }
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
