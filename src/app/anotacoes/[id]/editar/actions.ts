"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/session";
import {
  EditableNoteNotFoundError,
  InvalidNoteCatalogError,
  updateBasicNote
} from "@/lib/notes/mutations";

export type EditNoteField = "title" | "summary" | "content" | "area" | "category" | "tags";

export type UpdateNoteActionResult =
  | {
      success: true;
      slug: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<EditNoteField, string>>;
    };

export async function updateNoteAction(slug: string, formData: FormData): Promise<UpdateNoteActionResult> {
  const currentUser = await requireCurrentUser();
  const targetSlug = typeof slug === "string" ? slug.trim() : "";

  if (!targetSlug) {
    notFound();
  }

  const parsedInput = parseFormData(formData);

  if (!parsedInput.success) {
    return parsedInput.result;
  }

  let stableSlug: string;

  try {
    const note = await updateBasicNote({
      slug: targetSlug,
      ...parsedInput.data,
      userId: currentUser.id
    });

    stableSlug = note.slug;
  } catch (error) {
    if (error instanceof EditableNoteNotFoundError) {
      notFound();
    }

    if (error instanceof InvalidNoteCatalogError) {
      return {
        success: false,
        message: "Revise a organização da anotação.",
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Falha inesperada ao editar anotação.", error);

    return {
      success: false,
      message: "Não foi possível salvar as alterações agora. Tente novamente."
    };
  }

  try {
    revalidateAffectedPaths(stableSlug);
  } catch (error) {
    console.error("A anotação foi atualizada, mas as leituras não puderam ser revalidadas.", error);
  }

  return {
    success: true,
    slug: stableSlug
  };
}

function parseFormData(formData: FormData) {
  const titleValue = formData.get("title");
  const summaryValue = formData.get("summary");
  const contentValue = formData.get("content");
  const areaIdValue = formData.get("areaId");
  const categoryIdValue = formData.get("categoryId");
  const favoriteValue = formData.get("favorite");
  const tagIdValues = formData.getAll("tagIds");
  const fieldErrors: Partial<Record<EditNoteField, string>> = {};

  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const summary = typeof summaryValue === "string" ? summaryValue.trim() : "";
  const content = typeof contentValue === "string" ? contentValue.trim() : "";
  const areaId = typeof areaIdValue === "string" ? areaIdValue.trim() : "";
  const categoryId = typeof categoryIdValue === "string" ? categoryIdValue.trim() : "";

  if (title.length < 3) {
    fieldErrors.title = "Use um título com pelo menos 3 caracteres.";
  }

  if (!content) {
    fieldErrors.content = "Informe o conteúdo da anotação.";
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

  if (favoriteValue !== "true" && favoriteValue !== "false") {
    return invalidFormResult({
      message: "Os dados enviados não são válidos. Revise o formulário."
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
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
      areaId,
      categoryId,
      tagIds,
      favorite: favoriteValue === "true"
    }
  };
}

function invalidFormResult(result: Omit<Extract<UpdateNoteActionResult, { success: false }>, "success">) {
  return {
    success: false as const,
    result: {
      success: false as const,
      ...result
    }
  };
}

function revalidateAffectedPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/anotacoes");
  revalidatePath(`/anotacoes/${slug}`);
  revalidatePath("/areas");
  revalidatePath("/tags");
  revalidatePath("/favoritos");
}
