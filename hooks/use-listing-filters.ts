"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { filtersToSearchParams, parseFilters } from "@/lib/filter";
import type { ListingFilters } from "@/lib/types";

/**
 * Source de vérité des filtres = l'URL. Le queryKey TanStack dérive de là,
 * ce qui rend chaque état de recherche partageable et navigable (back/forward).
 */
export function useListingFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = parseFilters(new URLSearchParams(searchParams.toString()));

  const setFilters = useCallback(
    (next: ListingFilters) => {
      const p = filtersToSearchParams(next).toString();
      router.replace(p ? `${pathname}?${p}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  const patch = useCallback(
    (partial: Partial<ListingFilters>) => {
      setFilters({ ...filters, ...partial });
    },
    [filters, setFilters]
  );

  return { filters, setFilters, patch };
}
