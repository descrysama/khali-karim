import type { DpeClass, Listing, PropertyType } from "./types";

export const DPE_ORDER: DpeClass[] = ["A", "B", "C", "D", "E", "F", "G"];

export const DPE_COLORS: Record<DpeClass, string> = {
  A: "#2f8f63",
  B: "#4a9b58",
  C: "#8bbb4a",
  D: "#e2c53c",
  E: "#e59b31",
  F: "#d97030",
  G: "#c94a3c",
};

/** Classe Tailwind d'arrière-plan par lettre DPE (échelle réglementaire). */
export const DPE_BG: Record<DpeClass, string> = {
  A: "bg-dpe-a",
  B: "bg-dpe-b",
  C: "bg-dpe-c",
  D: "bg-dpe-d",
  E: "bg-dpe-e",
  F: "bg-dpe-f",
  G: "bg-dpe-g",
};

/** Variante atténuée pour les cases inactives de l'échelle DPE. */
export const DPE_BG_SOFT: Record<DpeClass, string> = {
  A: "bg-dpe-a/30",
  B: "bg-dpe-b/30",
  C: "bg-dpe-c/30",
  D: "bg-dpe-d/30",
  E: "bg-dpe-e/30",
  F: "bg-dpe-f/30",
  G: "bg-dpe-g/30",
};

interface CityDef {
  city: string;
  gov: string;
  zone: string;
}

const CITIES: CityDef[] = [
  { city: "La Marsa", gov: "Tunis", zone: "Marsa Plage" },
  { city: "Carthage", gov: "Tunis", zone: "Carthage Salammbô" },
  { city: "Tunis", gov: "Tunis", zone: "Lac 2" },
  { city: "Ariana", gov: "Ariana", zone: "Ennasr 2" },
  { city: "La Soukra", gov: "Ariana", zone: "Chotrana" },
  { city: "Hammamet", gov: "Nabeul", zone: "Hammamet Nord" },
  { city: "Nabeul", gov: "Nabeul", zone: "Centre" },
  { city: "Sousse", gov: "Sousse", zone: "Sousse Corniche" },
  { city: "Monastir", gov: "Monastir", zone: "Marina" },
  { city: "Sfax", gov: "Sfax", zone: "Route de l'Aéroport" },
  { city: "Djerba", gov: "Médenine", zone: "Houmt Souk" },
  { city: "Ben Arous", gov: "Ben Arous", zone: "Ezzahra" },
];

interface KindDef {
  type: PropertyType;
  label: string;
  pm2: number;
}

const KINDS: KindDef[] = [
  { type: "Appartement", label: "Appartement", pm2: 2600 },
  { type: "Maison", label: "Villa", pm2: 2200 },
  { type: "Maison", label: "Maison de ville", pm2: 1900 },
  { type: "Immeuble", label: "Immeuble de rapport", pm2: 1700 },
  { type: "Terrain", label: "Terrain constructible", pm2: 480 },
  { type: "Local commercial", label: "Local commercial", pm2: 2400 },
  { type: "Parking", label: "Place de parking", pm2: 900 },
];

export const PHOTO_SUBJECTS = [
  "séjour",
  "façade",
  "terrasse",
  "cuisine",
  "chambre",
  "vue mer",
  "jardin",
  "salle d'eau",
];

const PHOTO_SETS: Record<string, string[]> = {
  Appartement: [
    "photo-1502672260266-1c1ef2d93688",
    "photo-1600585154340-be6161a56a0c",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1493809842364-78817add7ffb",
    "photo-1554995207-c18c203602cb",
    "photo-1586023492125-27b2c045efd7",
    "photo-1502005229762-cf1b2da7c5d6",
    "photo-1519710164239-da123dc03ef4",
    "photo-1556909212-d5b604d0c90d",
  ],
  Maison: [
    "photo-1613490493576-7fde63acd811",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1512917774080-9991f1c4c750",
    "photo-1568605114967-8130f3a36994",
    "photo-1580587771525-78b9dba3b914",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1583608205776-bfd35f0d9f83",
    "photo-1570129477492-45c003edd2be",
    "photo-1564013799919-ab600027ffc6",
  ],
  Immeuble: [
    "photo-1486406146926-c627a92ad1ab",
    "photo-1449844908441-8829872d2607",
    "photo-1460317442991-0ec209397118",
    "photo-1517840901100-8179e982acb7",
    "photo-1494526585095-c41746248156",
    "photo-1512699355324-f07e3106dae5",
    "photo-1470723710355-95304d8aece4",
    "photo-1523192193543-6e7296d960e4",
  ],
  Terrain: [],
  "Local commercial": [
    "photo-1441986300917-64674bd600d8",
    "photo-1555529669-e69e7aa0ba9a",
    "photo-1604014237800-1c9102c219da",
    "photo-1567521464027-f127ff144326",
    "photo-1582037928769-181f2644ecb7",
    "photo-1560472354-b33ff0c44a43",
    "photo-1519415943484-9fa1873496d4",
    "photo-1533090161767-e6ffed986c88",
  ],
  Parking: [
    "photo-1590674899484-d5640e854abe",
    "photo-1506521781263-d8422e82f27a",
    "photo-1545179605-1296651e9d43",
    "photo-1573348722427-f1d6819fdf98",
    "photo-1470224114660-3f6686c562eb",
    "photo-1517672651691-24622a91b550",
  ],
};

/** URL Unsplash pour un type + index. `null` pour les terrains (placeholder). */
export function photoUrl(
  type: string,
  i: number,
  w: number
): string | null {
  const set = PHOTO_SETS[type] ?? PHOTO_SETS.Maison;
  if (!set.length) return null;
  return (
    "https://images.unsplash.com/" +
    set[Math.abs(i) % set.length] +
    "?auto=format&fit=crop&w=" +
    w +
    "&q=70"
  );
}

function buildListings(): Listing[] {
  const typeCounters: Record<string, number> = {};
  const nextPhotoSeed = (type: string) => {
    typeCounters[type] = (typeCounters[type] || 0) + 1;
    return typeCounters[type] - 1;
  };

  const out: Listing[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let i = 0; i < 48; i++) {
    const loc = CITIES[i % CITIES.length];
    const kind = KINDS[Math.floor(rnd() * KINDS.length)];
    const isLand = kind.type === "Terrain";
    const isParking = kind.type === "Parking";
    const isFlat =
      kind.type === "Appartement" || kind.type === "Local commercial";
    const transaction = isLand ? "vente" : rnd() > 0.32 ? "vente" : "location";
    const surface = isLand
      ? Math.round(200 + rnd() * 900)
      : isParking
        ? 14
        : Math.round(45 + rnd() * 240);
    const rooms = isLand || isParking ? 0 : Math.max(1, Math.round(surface / 32));
    const bedrooms = rooms > 1 ? rooms - 1 : 0;
    const base = surface * kind.pm2 * (0.85 + rnd() * 0.5);
    const price =
      transaction === "vente"
        ? Math.round(base / 1000) * 1000
        : Math.round(base / 190 / 50) * 50;
    const dpe = DPE_ORDER[Math.floor(rnd() * 5)];
    const floorTotal = Math.round(2 + rnd() * 6);
    const floor = Math.round(rnd() * floorTotal);

    out.push({
      id: "DN" + (1200 + i),
      type: kind.type,
      kindLabel: kind.label,
      transaction,
      city: loc.city,
      gov: loc.gov,
      zone: loc.zone,
      surface,
      rooms,
      bedrooms,
      price,
      dpe,
      ges: DPE_ORDER[Math.min(6, DPE_ORDER.indexOf(dpe) + 1)],
      exterior: rnd() > 0.42,
      elevator: isFlat && rnd() > 0.5,
      floor: isFlat ? floor : null,
      floorTotal,
      photos: 4 + Math.floor(rnd() * 12),
      isNew: rnd() > 0.72,
      year: 1985 + Math.floor(rnd() * 38),
      charges: Math.round(40 + rnd() * 160),
      subject: PHOTO_SUBJECTS[i % PHOTO_SUBJECTS.length],
      photoSeed: nextPhotoSeed(kind.type),
      hasEnergy: !isLand && !isParking,
      isLand,
      isParking,
    });
  }
  return out;
}

export const LISTINGS: Listing[] = buildListings();

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((it) => it.id === id);
}

/** Sujets photo par nature de bien (utilisé par la lightbox). */
export function subjectsFor(it: Listing): string[] {
  if (it.isLand)
    return [
      "vue d'ensemble",
      "façade sur rue",
      "limites de parcelle",
      "accès",
      "environnement",
      "plan de bornage",
    ];
  if (it.isParking)
    return ["emplacement", "accès", "rampe", "portail", "immeuble", "plan"];
  if (it.type === "Appartement" || it.type === "Maison") return PHOTO_SUBJECTS;
  return ["façade", "vitrine", "espace principal", "réserve", "sanitaires", "rue"];
}

export interface GalleryPhoto {
  url: string | null;
  subject: string;
}

export function galleryFor(it: Listing, w = 1800): GalleryPhoto[] {
  const subs = subjectsFor(it);
  return [0, 1, 2, 3, 4, 5].map((n) => ({
    url: photoUrl(it.type, it.photoSeed + n, w),
    subject: subs[(it.photoSeed + n) % subs.length],
  }));
}
