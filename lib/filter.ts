import type { ListingFilters, SortKey } from "./types";

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
