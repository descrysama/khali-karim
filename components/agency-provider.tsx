"use client";

import { createContext, useContext } from "react";
import type { Agency } from "@/lib/agency";

const AgencyContext = createContext<Agency | null>(null);

/** Fiche agence chargée côté serveur (layout), partagée avec les composants client. */
export function AgencyProvider({
  agency,
  children,
}: {
  agency: Agency;
  children: React.ReactNode;
}) {
  return (
    <AgencyContext.Provider value={agency}>{children}</AgencyContext.Provider>
  );
}

export function useAgency(): Agency {
  const agency = useContext(AgencyContext);
  if (!agency) throw new Error("useAgency doit être utilisé dans AgencyProvider");
  return agency;
}
