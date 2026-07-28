import { DPE_ORDER, LISTINGS } from "./listings";
import type { DpeClass, Listing, ListingFilters, SortKey } from "./types";

export const DEFAULT_FILTERS: ListingFilters = {
  q: "",
  region: "",
  transaction: "vente",
  type: "",
  budget: "0",
  rooms: "0",
  surfaceMin: "0",
  dpeMax: "",
  exterior: false,
  elevator: false,
  sort: "recent",
};

const SORTS: SortKey[] = ["recent", "price-asc", "price-desc", "surface-desc"];

export function applyFilters(
  filters: ListingFilters,
  listings: Listing[] = LISTINGS
): Listing[] {
  const q = filters.q.trim().toLowerCase();
  let list = listings.filter((it) => {
    if (it.transaction !== filters.transaction) return false;
    if (filters.region && it.gov !== filters.region) return false;
    if (q && !(it.city + " " + it.zone + " " + it.gov).toLowerCase().includes(q))
      return false;
    if (filters.type && it.type !== filters.type) return false;
    if (+filters.budget && it.price > +filters.budget) return false;
    if (+filters.rooms && it.rooms < +filters.rooms) return false;
    if (+filters.surfaceMin && it.surface < +filters.surfaceMin) return false;
    if (
      filters.dpeMax &&
      DPE_ORDER.indexOf(it.dpe) > DPE_ORDER.indexOf(filters.dpeMax as DpeClass)
    )
      return false;
    if (filters.exterior && !it.exterior) return false;
    if (filters.elevator && !it.elevator) return false;
    return true;
  });

  if (filters.sort === "price-asc")
    list = list.slice().sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc")
    list = list.slice().sort((a, b) => b.price - a.price);
  if (filters.sort === "surface-desc")
    list = list.slice().sort((a, b) => b.surface - a.surface);
  return list;
}

/** Nombre de filtres actifs affichés dans le badge « Tous les filtres ». */
export function activeFilterCount(f: ListingFilters): number {
  return [
    f.type,
    +f.budget || "",
    +f.rooms || "",
    +f.surfaceMin || "",
    f.dpeMax,
    f.exterior,
    f.elevator,
  ].filter(Boolean).length;
}

export function parseFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): ListingFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const transaction = get("transaction") === "location" ? "location" : "vente";
  const sortRaw = get("sort");
  const sort = SORTS.includes(sortRaw as SortKey)
    ? (sortRaw as SortKey)
    : "recent";

  return {
    q: get("q") ?? "",
    region: get("region") ?? "",
    transaction,
    type: get("type") ?? "",
    budget: get("budget") ?? "0",
    rooms: get("rooms") ?? "0",
    surfaceMin: get("surfaceMin") ?? "0",
    dpeMax: get("dpeMax") ?? "",
    exterior: get("exterior") === "1",
    elevator: get("elevator") === "1",
    sort,
  };
}

/** Sérialise les filtres non-défaut en query string (URL courte et propre). */
export function filtersToSearchParams(f: ListingFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.region) p.set("region", f.region);
  if (f.transaction !== "vente") p.set("transaction", f.transaction);
  if (f.type) p.set("type", f.type);
  if (+f.budget) p.set("budget", f.budget);
  if (+f.rooms) p.set("rooms", f.rooms);
  if (+f.surfaceMin) p.set("surfaceMin", f.surfaceMin);
  if (f.dpeMax) p.set("dpeMax", f.dpeMax);
  if (f.exterior) p.set("exterior", "1");
  if (f.elevator) p.set("elevator", "1");
  if (f.sort !== "recent") p.set("sort", f.sort);
  return p;
}
