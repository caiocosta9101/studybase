"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/session";
import {
  EditableNoteNotFoundError,
  InvalidNoteCatalogError,
  updateBasicNote,
  updateSnippetNote,
  type CreatableNoteType
} from "@/lib/notes/mutations";

type EditableNoteType = CreatableNoteType | "SNIPPET";

const editableNoteTypes = new Set<EditableNoteType>(["SIMPLE", "GUIDE", "SNIPPET", "ERROR_SOLUTION"]);

export type EditNoteField =
  | "title"
  | "summary"
  | "content"
  | "area"
  | "category"
  | "tags"
  | "language"
  | "code"
  | "explanation";

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
    const note =
      parsedInput.data.type === "SNIPPET"
        ? await updateSnippetNote({
            slug: targetSlug,
            title: parsedInput.data.title,
            summary: parsedInput.data.summary,
            content: parsedInput.data.content,
            favorite: parsedInput.data.favorite,
            areaId: parsedInput.data.areaId,
            categoryId: parsedInput.data.categoryId,
            tagIds: parsedInput.data.tagIds,
            userId: currentUser.id,
            language: parsedInput.data.language,
            code: parsedInput.data.code,
            explanation: parsedInput.data.explanation
          })
        : await updateBasicNote({
            slug: targetSlug,
            title: parsedInput.data.title,
            summary: parsedInput.data.summary,
            content: parsedInput.data.content,
            favorite: parsedInput.data.favorite,
            areaId: parsedInput.data.areaId,
            categoryId: parsedInput.data.categoryId,
            tagIds: parsedInput.data.tagIds,
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
  const typeValue = formData.get("type");
  const areaIdValue = formData.get("areaId");
  const categoryIdValue = formData.get("categoryId");
  const favoriteValue = formData.get("favorite");
  const languageValue = formData.get("language");
  const codeValue = formData.get("code");
  const explanationValue = formData.get("explanation");
  const tagIdValues = formData.getAll("tagIds");
  const fieldErrors: Partial<Record<EditNoteField, string>> = {};

  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const summary = typeof summaryValue === "string" ? summaryValue.trim() : "";
  const content = typeof contentValue === "string" ? contentValue.trim() : "";
  const type = typeof typeValue === "string" ? typeValue : "";
  const areaId = typeof areaIdValue === "string" ? areaIdValue.trim() : "";
  const categoryId = typeof categoryIdValue === "string" ? categoryIdValue.trim() : "";
  const language = typeof languageValue === "string" ? languageValue.trim() : "";
  const code = typeof codeValue === "string" ? codeValue : "";
  const explanation = typeof explanationValue === "string" ? explanationValue.trim() : "";

  if (title.length < 3) {
    fieldErrors.title = "Use um título com pelo menos 3 caracteres.";
  }

  if (contentValue !== null && typeof contentValue !== "string") {
    fieldErrors.content = "Informe um conteúdo válido.";
  } else if (type !== "SNIPPET" && !content) {
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

  if (type === "SNIPPET") {
    if (!language) {
      fieldErrors.language = "Informe a linguagem do snippet.";
    }

    if (!code.trim()) {
      fieldErrors.code = "Informe o código do snippet.";
    }

    if (explanationValue !== null && typeof explanationValue !== "string") {
      fieldErrors.explanation = "Informe uma explicação válida.";
    }
  }

  if (favoriteValue !== "true" && favoriteValue !== "false") {
    return invalidFormResult({
      message: "Os dados enviados não são válidos. Revise o formulário."
    });
  }

  if (Object.keys(fieldErrors).length > 0 || !isEditableNoteType(type)) {
    return invalidFormResult({
      message: "Revise os campos destacados antes de salvar.",
      fieldErrors
    });
  }

  if (type === "SNIPPET") {
    return {
      success: true as const,
      data: {
        title,
        summary: summary || null,
        content: content || null,
        type,
        areaId,
        categoryId,
        tagIds,
        favorite: favoriteValue === "true",
        language,
        code,
        explanation: explanation || null
      }
    };
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
      favorite: favoriteValue === "true"
    }
  };
}

function isEditableNoteType(value: string): value is EditableNoteType {
  return editableNoteTypes.has(value as EditableNoteType);
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
