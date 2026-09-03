"use client";

import { useCallback, useRef, useState } from "react";
import {
  setNoteFavoriteAction,
  type SetNoteFavoriteActionResult
} from "@/app/anotacoes/favorite-actions";

export function useNoteFavoriteMutation() {
  const pendingSlugsRef = useRef(new Set<string>());
  const [pendingSlugs, setPendingSlugs] = useState(() => new Set<string>());

  const setFavorite = useCallback(
    async (slug: string, favorite: boolean): Promise<SetNoteFavoriteActionResult | null> => {
      if (pendingSlugsRef.current.has(slug)) {
        return null;
      }

      pendingSlugsRef.current.add(slug);
      setPendingSlugs((currentSlugs) => new Set(currentSlugs).add(slug));

      try {
        return await setNoteFavoriteAction(slug, favorite);
      } catch {
        return {
          success: false,
          message: "Não foi possível atualizar o favorito agora. Tente novamente."
        };
      } finally {
        pendingSlugsRef.current.delete(slug);
        setPendingSlugs((currentSlugs) => {
          const nextSlugs = new Set(currentSlugs);
          nextSlugs.delete(slug);
          return nextSlugs;
        });
      }
    },
    []
  );

  const isFavoritePending = useCallback((slug: string) => pendingSlugs.has(slug), [pendingSlugs]);

  return {
    setFavorite,
    isFavoritePending
  };
}
