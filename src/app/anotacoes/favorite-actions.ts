"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { setNoteFavorite } from "@/lib/notes/mutations";

export type SetNoteFavoriteActionResult =
  | {
      success: true;
      favorite: boolean;
    }
  | {
      success: false;
      message: string;
    };

export async function setNoteFavoriteAction(slug: unknown, favorite: unknown): Promise<SetNoteFavoriteActionResult> {
  const currentUser = await requireCurrentUser();
  const targetSlug = typeof slug === "string" ? slug.trim() : "";

  if (!targetSlug || typeof favorite !== "boolean") {
    return {
      success: false,
      message: "Não foi possível atualizar o favorito. Revise os dados e tente novamente."
    };
  }

  let updatedNote: Awaited<ReturnType<typeof setNoteFavorite>>;

  try {
    updatedNote = await setNoteFavorite({
      slug: targetSlug,
      favorite,
      userId: currentUser.id
    });
  } catch (error) {
    console.error("Falha inesperada ao atualizar favorito.", error);

    return {
      success: false,
      message: "Não foi possível atualizar o favorito agora. Tente novamente."
    };
  }

  if (!updatedNote) {
    return {
      success: false,
      message: "A anotação não está mais disponível para atualização."
    };
  }

  try {
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/anotacoes");
    revalidatePath("/favoritos");
    revalidatePath(`/anotacoes/${targetSlug}`);
    revalidatePath(`/anotacoes/${targetSlug}/editar`);
  } catch (error) {
    console.error("O favorito foi atualizado, mas as páginas relacionadas não puderam ser revalidadas.", error);
  }

  return {
    success: true,
    favorite: updatedNote.favorite
  };
}
