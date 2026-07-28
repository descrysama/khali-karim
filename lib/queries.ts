"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { filtersToSearchParams } from "./filter";
import type { Listing, ListingFilters, ListingsPage } from "./types";

async function fetchListings(
  filters: ListingFilters,
  page: number
): Promise<ListingsPage> {
  const params = filtersToSearchParams(filters);
  params.set("page", String(page));
  const res = await fetch(`/api/listings?${params.toString()}`);
  if (!res.ok) throw new Error("Erreur de chargement des annonces");
  return res.json();
}

export function useListings(filters: ListingFilters) {
  return useInfiniteQuery({
    queryKey: ["listings", filters],
    queryFn: ({ pageParam }) => fetchListings(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

interface ListingDetail {
  listing: Listing;
  similar: Listing[];
}

async function fetchListing(id: string): Promise<ListingDetail> {
  const res = await fetch(`/api/listings/${id}`);
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("Erreur de chargement du bien");
  return res.json();
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
  });
}
