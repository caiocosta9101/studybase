"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import {
  createBasicNote,
  InvalidNoteCatalogError,
  NoteSlugGenerationError,
  type CreatableNoteType
} from "@/lib/notes/mutations";

const creatableNoteTypes = new Set<CreatableNoteType>(["SIMPLE", "GUIDE", "ERROR_SOLUTION"]);

export type CreateNoteField = "title" | "summary" | "content" | "type" | "area" | "category" | "tags";

export type CreateNoteActionResult =
  | {
      success: true;
      slug: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<CreateNoteField, string>>;
    };

export async function createNoteAction(formData: FormData): Promise<CreateNoteActionResult> {
  const currentUser = await requireCurrentUser();
  const parsedInput = parseFormData(formData);

  if (!parsedInput.success) {
    return parsedInput.result;
  }

  let slug: string;

  try {
    const note = await createBasicNote({
      ...parsedInput.data,
      userId: currentUser.id
    });

    slug = note.slug;
  } catch (error) {
    if (error instanceof InvalidNoteCatalogError) {
      return {
        success: false,
        message: "Revise a organização da anotação.",
        fieldErrors: error.fieldErrors
      };
    }

    if (error instanceof NoteSlugGenerationError) {
      return {
        success: false,
        message: "Não foi possível concluir a criação da anotação. Tente novamente."
      };
    }

    console.error("Falha inesperada ao criar anotação.", error);

    return {
      success: false,
      message: "Não foi possível salvar a anotação agora. Tente novamente."
    };
  }

  try {
    revalidateAffectedPaths(parsedInput.data.tagIds.length > 0, parsedInput.data.favorite);
  } catch (error) {
    console.error("A anotação foi criada, mas as leituras não puderam ser revalidadas.", error);
  }

  return {
    success: true,
    slug
  };
}

function parseFormData(formData: FormData) {
  const titleValue = formData.get("title");
  const summaryValue = formData.get("summary");
  const contentValue = formData.get("content");
  const typeValue = formData.get("type");
  const areaIdValue = formData.get("areaId");
  const categoryIdValue = formData.get("categoryId");
  const favoriteValue = formData.get("favorite");
  const tagIdValues = formData.getAll("tagIds");
  const fieldErrors: Partial<Record<CreateNoteField, string>> = {};

  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const summary = typeof summaryValue === "string" ? summaryValue.trim() : "";
  const content = typeof contentValue === "string" ? contentValue.trim() : "";
  const type = typeof typeValue === "string" ? typeValue : "";
  const areaId = typeof areaIdValue === "string" ? areaIdValue.trim() : "";
  const categoryId = typeof categoryIdValue === "string" ? categoryIdValue.trim() : "";

  if (title.length < 3) {
    fieldErrors.title = "Use um título com pelo menos 3 caracteres.";
  }

  if (!content) {
    fieldErrors.content = "Informe o conteúdo da anotação.";
  }

  if (!isCreatableNoteType(type)) {
    fieldErrors.type = "Selecione um tipo de anotação disponível.";
  }

  if (!areaId) {
    fieldErrors.area = "Selecione uma área.";
  }

  if (!categoryId) {
    fieldErrors.category = "Selecione uma categoria.";
  }

  const hasInvalidTagId = tagIdValues.some((tagId) => typeof tagId !== "string" || !tagId.trim());
  const tagIds = hasInvalidTagId
    ? []
    : Array.from(new Set(tagIdValues.map((tagId) => String(tagId).trim())));

  if (hasInvalidTagId) {
    fieldErrors.tags = "Selecione apenas tags disponíveis.";
  }

  if (summaryValue !== null && typeof summaryValue !== "string") {
    fieldErrors.summary = "Informe um resumo válido.";
  }

  const favorite = favoriteValue === "true";

  if (favoriteValue !== null && favoriteValue !== "true" && favoriteValue !== "false") {
    return invalidFormResult({
      message: "Os dados enviados não são válidos. Revise o formulário."
    });
  }

  if (Object.keys(fieldErrors).length > 0 || !isCreatableNoteType(type)) {
    return invalidFormResult({
      message: "Revise os campos destacados antes de salvar.",
      fieldErrors
    });
  }

  return {
    success: true as const,
    data: {
      title,
      summary: summary || null,
      content,
      type,
      areaId,
      categoryId,
      tagIds,
      favorite
    }
  };
}

function invalidFormResult(result: Omit<Extract<CreateNoteActionResult, { success: false }>, "success">) {
  return {
    success: false as const,
    result: {
      success: false as const,
      ...result
    }
  };
}

function isCreatableNoteType(value: string): value is CreatableNoteType {
  return creatableNoteTypes.has(value as CreatableNoteType);
}

function revalidateAffectedPaths(hasTags: boolean, favorite: boolean) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/anotacoes");
  revalidatePath("/areas");

  if (hasTags) {
    revalidatePath("/tags");
  }

  if (favorite) {
    revalidatePath("/favoritos");
  }
}
