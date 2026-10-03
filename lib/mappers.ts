import type {
  Listing,
  ListingPhoto,
  PropertyType,
  Transaction,
} from "./types";

/** Forme publique renvoyée par le backend (cf. toPublicProperty). */
export interface BackendProperty {
  id: string;
  reference: string;
  type: string; // enum bas-de-casse : appartement, maison, terrain, ...
  kindLabel: string;
  transaction: Transaction;
  city: string | null;
  gov: string | null;
  govSlug: string | null;
  zone: string | null;
  surface: number;
  rooms: number | null;
  bedrooms: number | null;
  price: number;
  charges: number | null;
  exterior: boolean;
  elevator: boolean | null;
  floor: number | null;
  floorTotal: number | null;
  isNew: boolean;
  year: number | null;
  photos?: { id: string; url: string; alt: string | null }[];
  publicLat: number | null;
  publicLng: number | null;
  publicRadiusM: number | null;
}

export interface BackendPage {
  items: BackendProperty[];
  total: number;
  page: number;
  pageCount: number;
}

/** enum backend -> type d'affichage (capitalisé) utilisé par l'UI. */
const TYPE_FROM_BACKEND: Record<string, PropertyType> = {
  appartement: "Appartement",
  maison: "Maison",
  terrain: "Terrain",
  parking: "Parking",
  immeuble: "Immeuble",
  local_commercial: "Local commercial",
};

export const TYPE_TO_BACKEND: Record<PropertyType, string> = {
  Appartement: "appartement",
  Maison: "maison",
  Terrain: "terrain",
  Parking: "parking",
  Immeuble: "immeuble",
  "Local commercial": "local_commercial",
};

/** Nom de gouvernorat (valeur du filtre côté UI) -> slug attendu par le backend. */
export const GOV_NAME_TO_SLUG: Record<string, string> = {
  Tunis: "tunis",
  Ariana: "ariana",
  "Ben Arous": "ben-arous",
  Nabeul: "nabeul",
  Sousse: "sousse",
  Monastir: "monastir",
  Sfax: "sfax",
  Médenine: "medenine",
};

export const SORT_TO_BACKEND: Record<string, string> = {
  recent: "recent",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  "surface-desc": "surface_desc",
};

function absolutePhotoUrl(url: string, baseUrl: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapPhotos(
  photos: BackendProperty["photos"],
  baseUrl: string
): ListingPhoto[] {
  return (photos ?? []).map((p) => ({
    id: p.id,
    url: absolutePhotoUrl(p.url, baseUrl),
    alt: p.alt,
  }));
}

export function mapProperty(p: BackendProperty, baseUrl: string): Listing {
  const type = TYPE_FROM_BACKEND[p.type] ?? "Appartement";
  const isLand = type === "Terrain";
  const isParking = type === "Parking";

  return {
    id: p.id,
    reference: p.reference,
    type,
    kindLabel: p.kindLabel,
    transaction: p.transaction,
    city: p.city ?? "",
    gov: p.gov ?? "",
    govSlug: p.govSlug,
    zone: p.zone,
    surface: p.surface,
    rooms: p.rooms,
    bedrooms: p.bedrooms,
    price: p.price,
    charges: p.charges,
    exterior: p.exterior,
    elevator: p.elevator,
    floor: p.floor,
    floorTotal: p.floorTotal,
    isNew: p.isNew,
    year: p.year,
    photos: mapPhotos(p.photos, baseUrl),
    publicLat: p.publicLat,
    publicLng: p.publicLng,
    publicRadiusM: p.publicRadiusM,
    isLand,
    isParking,
  };
}
