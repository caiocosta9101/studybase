import "server-only";

import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const maximumSlugAttempts = 5;

export type CreatableNoteType = "SIMPLE" | "GUIDE" | "ERROR_SOLUTION";

export type CreateBasicNoteInput = {
  title: string;
  summary: string | null;
  content: string;
  type: CreatableNoteType;
  favorite: boolean;
  areaId: string;
  categoryId: string;
  tagIds: string[];
  userId: string;
};

export type NoteCatalogFieldErrors = Partial<Record<"area" | "category" | "tags", string>>;

export class InvalidNoteCatalogError extends Error {
  readonly fieldErrors: NoteCatalogFieldErrors;

  constructor(fieldErrors: NoteCatalogFieldErrors) {
    super("O catálogo selecionado não é válido.");
    this.name = "InvalidNoteCatalogError";
    this.fieldErrors = fieldErrors;
  }
}

export class NoteSlugGenerationError extends Error {
  constructor() {
    super("Não foi possível gerar um slug único para a anotação.");
    this.name = "NoteSlugGenerationError";
  }
}

export async function createBasicNote(input: CreateBasicNoteInput) {
  const tagIds = Array.from(new Set(input.tagIds));
  const baseSlug = createSlug(input.title);

  for (let attempt = 0; attempt < maximumSlugAttempts; attempt += 1) {
    const slug = createSlugCandidate(baseSlug, attempt);

    try {
      return await prisma.$transaction(async (transaction) => {
        await validateCatalogSelections(transaction, input.areaId, input.categoryId, tagIds);

        const note = await transaction.note.create({
          data: {
            title: input.title,
            slug,
            summary: input.summary,
            content: input.content,
            type: input.type,
            favorite: input.favorite,
            areaId: input.areaId,
            categoryId: input.categoryId,
            userId: input.userId
          },
          select: {
            id: true,
            slug: true
          }
        });

        if (tagIds.length > 0) {
          await transaction.noteTag.createMany({
            data: tagIds.map((tagId) => ({
              noteId: note.id,
              tagId
            }))
          });
        }

        return note;
      });
    } catch (error) {
      if (!isNoteSlugUniqueConstraintViolation(error)) {
        throw error;
      }
    }
  }

  throw new NoteSlugGenerationError();
}

async function validateCatalogSelections(
  transaction: Prisma.TransactionClient,
  areaId: string,
  categoryId: string,
  tagIds: string[]
) {
  const [area, category, tagCount] = await Promise.all([
    transaction.area.findUnique({
      where: {
        id: areaId
      },
      select: {
        id: true
      }
    }),
    transaction.category.findUnique({
      where: {
        id: categoryId
      },
      select: {
        areaId: true
      }
    }),
    tagIds.length > 0
      ? transaction.tag.count({
          where: {
            id: {
              in: tagIds
            }
          }
        })
      : Promise.resolve(0)
  ]);

  const fieldErrors: NoteCatalogFieldErrors = {};

  if (!area) {
    fieldErrors.area = "Selecione uma área válida.";
  }

  if (!category || category.areaId !== areaId) {
    fieldErrors.category = "Selecione uma categoria pertencente à área escolhida.";
  }

  if (tagCount !== tagIds.length) {
    fieldErrors.tags = "Uma ou mais tags selecionadas não estão disponíveis.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new InvalidNoteCatalogError(fieldErrors);
  }
}

function createSlug(title: string) {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || "anotacao";
}

function createSlugCandidate(baseSlug: string, attempt: number) {
  return attempt === 0 ? baseSlug : `${baseSlug}-${randomBytes(4).toString("hex")}`;
}

function isNoteSlugUniqueConstraintViolation(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return false;
  }

  if (error.meta?.modelName !== undefined && error.meta.modelName !== "Note") {
    return false;
  }

  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.length === 1 && target[0] === "slug";
  }

  if (target === "slug" || target === "Note_slug_key") {
    return true;
  }

  const driverAdapterError = error.meta?.driverAdapterError;

  if (!isRecord(driverAdapterError) || !isRecord(driverAdapterError.cause)) {
    return false;
  }

  if (driverAdapterError.cause.kind !== "UniqueConstraintViolation") {
    return false;
  }

  const constraint = driverAdapterError.cause.constraint;

  if (isRecord(constraint)) {
    if (Array.isArray(constraint.fields)) {
      return constraint.fields.length === 1 && constraint.fields[0] === "slug";
    }

    if (constraint.index === "Note_slug_key") {
      return true;
    }
  }

  const originalMessage = driverAdapterError.cause.originalMessage;

  return typeof originalMessage === "string" && originalMessage.includes("Note_slug_key");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
