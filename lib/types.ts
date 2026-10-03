export type Transaction = "vente" | "location";

export type PropertyType =
  | "Appartement"
  | "Maison"
  | "Immeuble"
  | "Terrain"
  | "Local commercial"
  | "Parking";


export interface ListingPhoto {
  id: string;
  url: string;
  alt: string | null;
}

export interface Listing {
  id: string;
  reference: string;
  type: PropertyType;
  kindLabel: string;
  transaction: Transaction;
  city: string;
  gov: string;
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
  photos: ListingPhoto[];
  publicLat: number | null;
  publicLng: number | null;
  publicRadiusM: number | null;
  // Dérivés côté mapping
  isLand: boolean;
  isParking: boolean;
}

export type SortKey = "recent" | "price-asc" | "price-desc" | "surface-desc";

export interface ListingFilters {
  q: string;
  region: string;
  transaction: Transaction;
  type: string;
  budget: string;
  rooms: string;
  surfaceMin: string;
  exterior: boolean;
  elevator: boolean;
  sort: SortKey;
}

export interface ListingsPage {
  items: Listing[];
  total: number;
  page: number;
  nextPage: number | null;
}
