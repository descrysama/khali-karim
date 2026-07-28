"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { TransactionTabs } from "@/components/transaction-tabs";
import { FilterDropdown } from "@/components/filter-dropdown";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { DEFAULT_FILTERS, filtersToSearchParams } from "@/lib/filter";
import type { Transaction } from "@/lib/types";

const HERO_BG =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=70";

export function HomeHero() {
  const t = useTranslations("hero");
  const router = useRouter();
  const options = useFilterOptions();
  const [transaction, setTransaction] = useState<Transaction>("vente");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const bg = HERO_BG;

  function search() {
    const qs = filtersToSearchParams({
      ...DEFAULT_FILTERS,
      transaction,
      region,
      type,
    }).toString();
    router.push(qs ? `/recherche?${qs}` : "/recherche");
  }

  return (
    <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-dark">
      <Image src={bg} alt="" fill priority className="object-cover" />
      <span className="absolute inset-0 bg-gradient-to-b from-dark/50 to-dark/80" />

      <div className="relative w-full max-w-[900px] px-7 py-[90px] text-center">
        <h1 className="text-[clamp(34px,5.4vw,58px)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h1>
        <p className="mx-auto mt-[18px] max-w-[46ch] text-[17px] leading-[1.5] text-white/75">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex justify-center">
          <TransactionTabs value={transaction} onChange={setTransaction} />
        </div>

        <div className="mt-[18px] flex flex-col items-stretch gap-1.5 rounded-3xl bg-background p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full">
          <FilterDropdown
            variant="plain"
            label={t("fieldGouvernorat")}
            value={region}
            onChange={setRegion}
            options={options.gov}
            defaultValue=""
            triggerClassName="flex-1 rounded-2xl hover:bg-muted sm:rounded-full sm:border-e sm:border-border sm:hover:bg-transparent"
          />
          <FilterDropdown
            variant="plain"
            label={t("fieldType")}
            value={type}
            onChange={setType}
            options={options.type}
            defaultValue=""
            triggerClassName="flex-1 rounded-2xl hover:bg-muted sm:rounded-full sm:hover:bg-transparent"
          />
          <button
            type="button"
            onClick={search}
            className="shrink-0 rounded-full bg-primary px-[30px] py-[15px] text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {t("search")}
          </button>
        </div>
      </div>
    </section>
  );
}
