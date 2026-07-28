import type { DpeClass } from "./types";

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
