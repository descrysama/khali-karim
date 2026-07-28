export type Transaction = "vente" | "location";

export type PropertyType =
  | "Appartement"
  | "Maison"
  | "Immeuble"
  | "Terrain"
  | "Local commercial"
  | "Parking";

export type DpeClass = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type Governorate =
  | "Tunis"
  | "Ariana"
  | "Ben Arous"
  | "Nabeul"
  | "Sousse"
  | "Monastir"
  | "Sfax"
  | "Médenine";

export interface Listing {
  id: string;
  type: PropertyType;
  kindLabel: string;
  transaction: Transaction;
  city: string;
  gov: string;
  zone: string;
  surface: number;
  rooms: number;
  bedrooms: number;
  price: number;
  dpe: DpeClass;
  ges: DpeClass;
  exterior: boolean;
  elevator: boolean;
  floor: number | null;
  floorTotal: number;
  photos: number;
  isNew: boolean;
  year: number;
  charges: number;
  subject: string;
  photoSeed: number;
  hasEnergy: boolean;
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
  dpeMax: string;
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
