"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/session";
import { deleteBasicOrSnippetNote } from "@/lib/notes/mutations";

export type DeleteNoteActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function deleteNoteAction(slug: string): Promise<DeleteNoteActionResult> {
  const currentUser = await requireCurrentUser();
  const targetSlug = typeof slug === "string" ? slug.trim() : "";

  if (!targetSlug) {
    notFound();
  }

  let deletedCount: number;

  try {
    const result = await deleteBasicOrSnippetNote({
      slug: targetSlug,
      userId: currentUser.id
    });

    deletedCount = result.count;
  } catch (error) {
    console.error("Falha inesperada ao excluir anotação.", error);

    return {
      success: false,
      message: "Não foi possível excluir a anotação agora. Tente novamente."
    };
  }

  if (deletedCount === 0) {
    notFound();
  }

  try {
    revalidatePath("/anotacoes");
  } catch (error) {
    console.error("A anotação foi excluída, mas a listagem não pôde ser revalidada.", error);
  }

  return {
    success: true
  };
}
