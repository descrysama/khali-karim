import type { Locale } from "@/i18n/routing";
import { API_URL, PUBLIC_API_URL } from "./api";

/** Fiche agence telle que renvoyée par le backend (GET /agency). */
export interface BackendAgency {
  nameFr: string;
  nameAr: string;
  phone: string;
  email: string;
  addressFr: string;
  addressAr: string;
  hoursFr: string;
  hoursAr: string;
  headlineFr: string;
  headlineAr: string;
  introFr: string;
  introAr: string;
  photoUrl: string | null;
}

/** Fiche agence dans la langue de la page. */
export interface Agency {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  headline: string;
  intro: string;
  photoUrl: string | null;
}

/** Valeurs affichées si l'API ne répond pas. */
const FALLBACK: BackendAgency = {
  nameFr: "Altayssir Immobilier",
  nameAr: "التيسير العقارية",
  phone: "+216 71 000 000",
  email: "contact@altayssir.com",
  addressFr: "Monastir",
  addressAr: "المنستير",
  hoursFr: "Lundi – samedi, 9h – 18h",
  hoursAr: "الإثنين – السبت، 9:00 – 18:00",
  headlineFr: "Parlons de votre projet.",
  headlineAr: "لنتحدّث عن مشروعك.",
  introFr:
    "Altayssir accompagne acheteurs, vendeurs et locataires à Monastir et dans sa région.",
  introAr:
    "ترافق التيسير المشترين والبائعين والمكترين في المنستير وجهتها.",
  photoUrl: null,
};

export async function getAgency(locale: Locale): Promise<Agency> {
  let data = FALLBACK;
  try {
    const res = await fetch(`${API_URL}/agency`, { cache: "no-store" });
    if (res.ok) data = (await res.json()) as BackendAgency;
  } catch {
    // API indisponible : on garde les valeurs par défaut.
  }
  const ar = locale === "ar";
  return {
    name: ar ? data.nameAr : data.nameFr,
    phone: data.phone,
    email: data.email,
    address: ar ? data.addressAr : data.addressFr,
    hours: ar ? data.hoursAr : data.hoursFr,
    headline: ar ? data.headlineAr : data.headlineFr,
    intro: ar ? data.introAr : data.introFr,
    photoUrl: data.photoUrl
      ? data.photoUrl.startsWith("http")
        ? data.photoUrl
        : `${PUBLIC_API_URL}${data.photoUrl}`
      : null,
  };
}

/** LRI…PDI : garde l'ordre des chiffres dans les textes en arabe (RTL). */
export function phoneDisplay(phone: string): string {
  return `⁦${phone}⁩`;
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
