import {
  GOV_NAME_TO_SLUG,
  SORT_TO_BACKEND,
  TYPE_TO_BACKEND,
  mapProperty,
  type BackendPage,
  type BackendProperty,
} from "./mappers";
import type { Listing, ListingsPage, PropertyType } from "./types";

export const API_URL = process.env.API_URL ?? "http://localhost:4001";
// URL vue par le navigateur pour les photos (/uploads/*). En prod, API_URL
// pointe sur le réseau Docker interne, inaccessible depuis le client.
export const PUBLIC_API_URL = process.env.PUBLIC_API_URL ?? API_URL;
export const PAGE_SIZE = 9;

export interface ListingsQuery {
  q?: string;
  region?: string;
  transaction?: string;
  type?: string;
  budget?: string;
  rooms?: string;
  surfaceMin?: string;
  exterior?: boolean;
  elevator?: boolean;
  sort?: string;
  page?: number; // 0-indexé (côté client)
  limit?: number;
}

function buildBackendParams(query: ListingsQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (query.transaction) p.set("transaction", query.transaction);
  if (query.type) {
    const backendType = TYPE_TO_BACKEND[query.type as PropertyType];
    if (backendType) p.set("type", backendType);
  }
  if (query.region) {
    const slug = GOV_NAME_TO_SLUG[query.region];
    if (slug) p.set("gov", slug);
  }
  if (query.q) p.set("q", query.q);
  if (query.budget && +query.budget > 0) p.set("budgetMax", query.budget);
  if (query.rooms && +query.rooms > 0) p.set("roomsMin", query.rooms);
  if (query.surfaceMin && +query.surfaceMin > 0)
    p.set("surfaceMin", query.surfaceMin);
  if (query.exterior) p.set("exterior", "true");
  if (query.elevator) p.set("elevator", "true");
  if (query.sort) p.set("sort", SORT_TO_BACKEND[query.sort] ?? "recent");

  const limit = query.limit ?? PAGE_SIZE;
  const page = (query.page ?? 0) + 1; // backend est 1-indexé
  p.set("page", String(page));
  p.set("limit", String(limit));
  return p;
}

export async function getListings(
  query: ListingsQuery
): Promise<ListingsPage> {
  const params = buildBackendParams(query);
  const res = await fetch(`${API_URL}/properties?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  const data = (await res.json()) as BackendPage;

  const clientPage = query.page ?? 0;
  const nextPage = data.page < data.pageCount ? clientPage + 1 : null;

  return {
    items: data.items.map((it) => mapProperty(it, PUBLIC_API_URL)),
    total: data.total,
    page: clientPage,
    nextPage,
  };
}

export async function getListing(id: string): Promise<Listing | null> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  const data = (await res.json()) as BackendProperty;
  return mapProperty(data, PUBLIC_API_URL);
}

export async function getSimilar(id: string): Promise<Listing[]> {
  const res = await fetch(`${API_URL}/properties/${id}/similar`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as BackendProperty[];
  return data.map((it) => mapProperty(it, PUBLIC_API_URL));
}

export interface HomeStats {
  total: number;
  vente: number;
  location: number;
  cities: number;
}

/** Chiffres réels de l'accueil (annonces publiées) ; null si l'API ne répond pas. */
export async function getStats(): Promise<HomeStats | null> {
  try {
    const res = await fetch(`${API_URL}/properties/stats`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as HomeStats;
  } catch {
    return null;
  }
}
