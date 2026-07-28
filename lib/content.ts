import type { Listing, PropertyType } from "./types";
import type { Locale } from "@/i18n/routing";

/** Espace fine insécable comme séparateur de milliers. */
const THIN = " ";

export function fmtNumber(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, THIN);
}

const CURRENCY: Record<Locale, string> = { fr: "DT", ar: "د.ت" };
const SQM: Record<Locale, string> = { fr: "m²", ar: "م²" };

export function isResidential(it: Listing): boolean {
  return it.type === "Appartement" || it.type === "Maison";
}

/* ------------------------------------------------------------------ */
/* Cartes de traduction du contenu (noms propres et libellés générés) */
/* ------------------------------------------------------------------ */

const TYPE_AR: Record<PropertyType, string> = {
  Appartement: "شقة",
  Maison: "منزل",
  Immeuble: "عمارة",
  Terrain: "أرض",
  "Local commercial": "محل تجاري",
  Parking: "موقف سيارة",
};

const CITY_AR: Record<string, string> = {
  "La Marsa": "المرسى",
  Carthage: "قرطاج",
  Tunis: "تونس",
  Ariana: "أريانة",
  "Ariana Ville": "أريانة المدينة",
  Ennasr: "النصر",
  "La Soukra": "السكرة",
  Raoued: "رواد",
  Ezzahra: "الزهراء",
  "Hammam Lif": "حمام الأنف",
  Mégrine: "مقرين",
  "El Menzah": "المنزه",
  "La Goulette": "حلق الوادي",
  Hammamet: "الحمامات",
  Nabeul: "نابل",
  Sousse: "سوسة",
  Monastir: "المنستير",
  Sfax: "صفاقس",
  Djerba: "جربة",
  "Houmt Souk": "حومة السوق",
  "Ben Arous": "بن عروس",
};

const GOV_AR: Record<string, string> = {
  Tunis: "تونس",
  Ariana: "أريانة",
  "Ben Arous": "بن عروس",
  Nabeul: "نابل",
  Sousse: "سوسة",
  Monastir: "المنستير",
  Sfax: "صفاقس",
  Médenine: "مدنين",
};

export function kindLabel(d: Listing, locale: Locale): string {
  return locale === "ar" ? TYPE_AR[d.type] ?? d.kindLabel : d.kindLabel;
}
export function cityLabel(city: string, locale: Locale): string {
  return locale === "ar" ? CITY_AR[city] ?? city : city;
}
export function zoneLabel(zone: string | null, locale: Locale): string {
  if (!zone) return "";
  return locale === "ar" ? CITY_AR[zone] ?? zone : zone;
}
export function govLabel(gov: string, locale: Locale): string {
  return locale === "ar" ? GOV_AR[gov] ?? gov : gov;
}

/* ------------------------------------------------------------------ */
/* Prix, unités, specs, titres                                        */
/* ------------------------------------------------------------------ */

export function priceLabel(d: Listing, locale: Locale): string {
  const base = fmtNumber(d.price) + " " + CURRENCY[locale];
  if (d.transaction !== "location") return base;
  return base + (locale === "ar" ? " / شهرياً" : " / mois");
}

export function unitLabel(d: Listing, locale: Locale): string {
  if (d.type === "Parking" || !d.surface) return "";
  const value = fmtNumber(d.price / d.surface);
  const per = CURRENCY[locale] + "/" + SQM[locale];
  if (d.transaction === "location")
    return value + " " + per + (locale === "ar" ? "/شهرياً" : "/mois");
  return value + " " + per;
}

function roomsUnit(d: Listing, locale: Locale): string {
  if (isResidential(d)) return locale === "ar" ? "غرف" : "pièces";
  if (d.type === "Immeuble") return locale === "ar" ? "وحدات" : "lots";
  return locale === "ar" ? "فضاءات" : "espaces";
}

export function specs(d: Listing, locale: Locale): string {
  const parts: string[] = [];
  if (d.rooms) parts.push(d.rooms + " " + roomsUnit(d, locale));
  if (d.bedrooms && isResidential(d))
    parts.push(d.bedrooms + (locale === "ar" ? " غرف نوم" : " chambres"));
  parts.push(d.surface + " " + SQM[locale]);
  if (d.floor !== null) {
    const total = d.floorTotal !== null ? "/" + d.floorTotal : "";
    parts.push((locale === "ar" ? "الطابق " : "étage ") + d.floor + total);
  }
  return parts.join("  ·  ");
}

function roomsSuffix(d: Listing, locale: Locale): string {
  if (!(d.rooms && isResidential(d))) return "";
  return locale === "ar" ? " " + d.rooms + " غرف" : " " + d.rooms + " pièces";
}

export function cardTitle(d: Listing, locale: Locale): string {
  return kindLabel(d, locale) + roomsSuffix(d, locale);
}

export function detailTitle(d: Listing, locale: Locale): string {
  return (
    kindLabel(d, locale) +
    roomsSuffix(d, locale) +
    " · " +
    d.surface +
    " " +
    SQM[locale]
  );
}

export function refLabel(d: Listing, locale: Locale): string {
  if (locale === "ar")
    return (
      "المرجع " + d.reference + " · " + (d.transaction === "vente" ? "للبيع" : "للكراء")
    );
  return (
    "Réf. " + d.reference + " · " + (d.transaction === "vente" ? "à vendre" : "à louer")
  );
}

export function placeLabel(d: Listing, locale: Locale): string {
  const zone = zoneLabel(d.zone, locale);
  const city = cityLabel(d.city, locale);
  const gov = govLabel(d.gov, locale);
  const head = zone ? (locale === "ar" ? zone + "، " + city : zone + ", " + city) : city;
  return gov ? head + " (" + gov + ")" : head;
}

/* ------------------------------------------------------------------ */
/* Descriptions                                                        */
/* ------------------------------------------------------------------ */

export function description(d: Listing, locale: Locale): string {
  const city = cityLabel(d.city, locale);
  const zone = d.zone ? zoneLabel(d.zone, locale) : city;
  const kind = kindLabel(d, locale);
  const facade = Math.round(Math.sqrt(d.surface) * 0.8);

  if (locale === "ar") {
    if (d.isLand) {
      return (
        "أرض مساحتها " +
        d.surface +
        " م² في " +
        zone +
        "، " +
        city +
        ". قطعة قابلة للبناء، مزوّدة بالمرافق (ماء، كهرباء، تطهير على حدود الملكية)، بواجهة على الطريق بطول نحو " +
        facade +
        " م. شهادة التعمير ومثال التحديد متوفّران بالوكالة. زيارة حرّة برفقة مفاوض القطاع."
      );
    }
    if (d.isParking) {
      return (
        "موقف سيارة " +
        (d.exterior ? "خارجي" : "في الطابق السفلي") +
        " في " +
        zone +
        "، " +
        city +
        ". الدخول " +
        (d.exterior ? "مباشر من الطريق" : "عبر بوابة بجهاز تحكّم") +
        "، مكان محدّد مساحته " +
        d.surface +
        " م²" +
        (d.charges ? "، ومعاليم الملكية المشتركة " + d.charges + " د.ت شهرياً" : "") +
        "."
      );
    }
    const dist = d.rooms
      ? isResidential(d)
        ? "التوزيع في " +
          d.rooms +
          " غرف" +
          (d.bedrooms ? " منها " + d.bedrooms + " غرف نوم" : "") +
          "، صالة عبور ومطبخ منفصل. "
        : d.type === "Immeuble"
          ? "عمارة مقسّمة إلى " +
            d.rooms +
            " وحدات مكتراة حالياً، والمردود الكرائي متاح بالوكالة. "
          : "مساحة قابلة للتقسيم إلى " + d.rooms + " فضاءات، واجهة على الطريق ومخزن. "
      : "";
    return (
      kind +
      " مساحته " +
      d.surface +
      " م² في " +
      zone +
      "، " +
      city +
      ". " +
      dist +
      (d.exterior ? "مساحة خارجية خاصة موجّهة نحو الجنوب الغربي. " : "") +
      (d.elevator ? "عمارة بمصعد وحارس. " : "") +
      (d.year ? "بُني سنة " + d.year + "، " : "") +
      "مع أشغال تجديد بحسب ذوق المشتري. زيارات برفقة مفاوض القطاع."
    );
  }

  // Français
  if (d.isLand) {
    return (
      "Terrain de " +
      d.surface +
      " m² à " +
      zone +
      ", " +
      city +
      ". Lot constructible, viabilisé (eau, électricité, assainissement en limite de propriété), façade sur rue d'environ " +
      facade +
      " m. Certificat d'urbanisme et plan de bornage disponibles à l'agence. Visite libre accompagnée d'un négociateur du secteur."
    );
  }
  if (d.isParking) {
    return (
      "Place de parking " +
      (d.exterior ? "extérieure" : "en sous-sol") +
      " à " +
      zone +
      ", " +
      city +
      ". Accès " +
      (d.exterior ? "direct depuis la rue" : "par portail télécommandé") +
      ", emplacement délimité de " +
      d.surface +
      " m²" +
      (d.charges ? ". Charges de copropriété " + d.charges + " DT / mois" : "") +
      "."
    );
  }
  const dist = d.rooms
    ? isResidential(d)
      ? "Distribution en " +
        d.rooms +
        " pièces" +
        (d.bedrooms ? " dont " + d.bedrooms + " chambres" : "") +
        ", séjour traversant et cuisine séparée. "
      : d.type === "Immeuble"
        ? "Immeuble divisé en " +
          d.rooms +
          " lots actuellement loués, rendement locatif consultable en agence. "
        : "Surface divisible en " + d.rooms + " espaces, vitrine sur rue et réserve. "
    : "";
  return (
    kind +
    " de " +
    d.surface +
    " m² situé à " +
    zone +
    ", " +
    city +
    ". " +
    dist +
    (d.exterior ? "Extérieur privatif exposé sud-ouest. " : "") +
    (d.elevator ? "Immeuble avec ascenseur et gardien. " : "") +
    (d.year ? "Construction " + d.year + ", " : "") +
    "travaux de rafraîchissement à prévoir selon le goût de l'acquéreur. Visites accompagnées par un négociateur du secteur."
  );
}

export function energyLine(d: Listing, locale: Locale): string {
  const dpe = d.dpe ?? "—";
  const ges = d.ges ?? "—";
  const charges = d.charges;
  if (locale === "ar")
    return (
      "صنف الطاقة " +
      dpe +
      " · صنف المناخ " +
      ges +
      (charges ? " · تقدير المعاليم " + charges + " د.ت شهرياً" : "")
    );
  return (
    "Classe énergie " +
    dpe +
    " · classe climat " +
    ges +
    (charges ? " · estimation des charges " + charges + " DT / mois" : "")
  );
}

export function legalLine(d: Listing, locale: Locale): string {
  if (locale === "ar")
    return (
      "المرجع " +
      d.reference +
      ". الأتعاب على عاتق البائع. معلومات غير تعاقدية وقابلة للتغيير."
    );
  return (
    "Réf. " +
    d.reference +
    ". Honoraires à la charge du vendeur. Informations non contractuelles, susceptibles de modification."
  );
}

/* ------------------------------------------------------------------ */
/* Faits (variables selon le type de bien)                             */
/* ------------------------------------------------------------------ */

export interface Fact {
  k: string;
  v: string | number;
}

export function facts(d: Listing, locale: Locale): Fact[] {
  const ar = locale === "ar";
  const yes = ar ? "نعم" : "Oui";
  const no = ar ? "لا" : "Non";
  const dash = "—";
  const sqm = SQM[locale];
  const surface = { k: ar ? "المساحة" : "Surface", v: d.surface + " " + sqm };

  if (d.isLand) {
    return [
      surface,
      { k: ar ? "قابلة للبناء" : "Constructible", v: yes },
      {
        k: ar ? "مزوّدة بالمرافق" : "Viabilisé",
        v: d.exterior ? yes : ar ? "جزئياً" : "Partiellement",
      },
      { k: ar ? "التصنيف" : "Zonage", v: ar ? "سكني" : "Habitation" },
    ];
  }
  if (d.isParking) {
    return [
      surface,
      {
        k: ar ? "الموقع" : "Emplacement",
        v: d.exterior ? (ar ? "خارجي" : "Extérieur") : ar ? "طابق سفلي" : "Sous-sol",
      },
      {
        k: ar ? "الدخول" : "Accès",
        v: d.exterior ? (ar ? "الطريق" : "Rue") : ar ? "جهاز تحكّم" : "Télécommande",
      },
      {
        k: ar ? "المعاليم" : "Charges",
        v: d.charges ? d.charges + (ar ? " د.ت شهرياً" : " DT / mois") : dash,
      },
    ];
  }
  const floor = {
    k: ar ? "الطابق" : "Étage",
    v:
      d.floor === null
        ? dash
        : d.floor + (d.floorTotal !== null ? " / " + d.floorTotal : ""),
  };
  const elevator = { k: ar ? "المصعد" : "Ascenseur", v: d.elevator ? yes : no };
  const year = { k: ar ? "السنة" : "Année", v: d.year ?? dash };
  const energy = { k: ar ? "الطاقة" : "Énergie", v: d.dpe ?? dash };

  if (!isResidential(d)) {
    return [
      surface,
      {
        k: d.type === "Immeuble" ? (ar ? "الوحدات" : "Lots") : ar ? "الفضاءات" : "Espaces",
        v: d.rooms ? d.rooms : dash,
      },
      floor,
      elevator,
      year,
      energy,
    ];
  }
  return [
    surface,
    { k: ar ? "الغرف" : "Pièces", v: d.rooms ? d.rooms : dash },
    { k: ar ? "غرف النوم" : "Chambres", v: d.bedrooms ? d.bedrooms : dash },
    floor,
    { k: ar ? "مساحة خارجية" : "Extérieur", v: d.exterior ? yes : no },
    elevator,
    year,
    energy,
  ];
}
