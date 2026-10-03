"use client";

import { useTranslations, useLocale } from "next-intl";
import { govLabel } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import type { DropdownOption } from "@/components/filter-dropdown";

const TYPE_VALUES = [
  "",
  "Appartement",
  "Maison",
  "Immeuble",
  "Terrain",
  "Local commercial",
  "Parking",
];
const BUDGET_VALUES = ["0", "150000", "300000", "600000", "1200000"];
const ROOMS_VALUES = ["0", "2", "3", "4", "5"];
const SURFACE_VALUES = ["0", "60", "100", "150", "250"];
const SORT_VALUES = ["recent", "price-asc", "price-desc", "surface-desc"];
const GOV_VALUES = [
  "",
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Nabeul",
  "Sousse",
  "Monastir",
  "Sfax",
  "Médenine",
];

export function useFilterOptions() {
  const t = useTranslations("filters");
  const locale = useLocale() as Locale;

  const map = (
    values: string[],
    key: (v: string) => string
  ): DropdownOption[] => values.map((v) => ({ value: v, label: t(key(v)) }));

  const numericKey = (empty: string) => (v: string) =>
    v === empty ? "any" : v;

  return {
    transaction: map(["vente", "location"], (v) => `opt.transaction.${v}`),
    type: map(TYPE_VALUES, (v) => `opt.type.${v === "" ? "all" : v}`),
    budget: map(BUDGET_VALUES, (v) => `opt.budget.${numericKey("0")(v)}`),
    rooms: map(ROOMS_VALUES, (v) => `opt.rooms.${numericKey("0")(v)}`),
    surface: map(SURFACE_VALUES, (v) => `opt.surface.${numericKey("0")(v)}`),
    sort: map(SORT_VALUES, (v) => `opt.sort.${v}`),
    gov: GOV_VALUES.map((v) => ({
      value: v,
      label: v === "" ? t("govAll") : govLabel(v, locale),
    })),
    budgetChips: map(BUDGET_VALUES, (v) => `chip.budget.${numericKey("0")(v)}`),
    roomsChips: map(ROOMS_VALUES, (v) => `chip.rooms.${numericKey("0")(v)}`),
    surfaceChips: map(SURFACE_VALUES, (v) => `chip.surface.${numericKey("0")(v)}`),
  };
}
