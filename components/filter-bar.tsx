"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/filter-dropdown";
import { AllFiltersDialog } from "@/components/all-filters-dialog";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { cn } from "@/lib/utils";
import type { ListingFilters } from "@/lib/types";

interface FilterBarProps {
  filters: ListingFilters;
  patch: (partial: Partial<ListingFilters>) => void;
  reset: () => void;
  count: number;
  total: number;
}

function pillClass(active: boolean) {
  return cn(
    "rounded-full border px-4 py-2 text-sm transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-input bg-background text-foreground hover:border-primary",
  );
}

export function FilterBar({
  filters,
  patch,
  reset,
  count,
  total,
}: FilterBarProps) {
  const t = useTranslations("filters");
  const options = useFilterOptions();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="sticky top-[68px] z-20 md:top-[74px] border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2.5 px-4 py-3.5 sm:px-7">
        <div className="relative flex w-full items-center sm:w-auto">
          <span className="pointer-events-none absolute start-4 z-10 size-1.5 rounded-full bg-primary" />
          <Input
            value={filters.q}
            onChange={(e) => patch({ q: e.target.value })}
            placeholder={t("searchPlaceholder")}
            className="h-9 w-full rounded-full ps-7 sm:w-auto sm:min-w-[230px]"
          />
        </div>

        {/* Mobile : ces filtres sont tous dans « Tous les filtres ». */}
        <div className="hidden md:contents">
          <FilterDropdown
            label={t("projet")}
            value={filters.transaction}
            onChange={(v) =>
              patch({ transaction: v as ListingFilters["transaction"] })
            }
            options={options.transaction}
            defaultValue="vente"
          />
          <FilterDropdown
            label={t("type")}
            value={filters.type}
            onChange={(v) => patch({ type: v })}
            options={options.type}
            defaultValue=""
          />
          <FilterDropdown
            label={t("budget")}
            value={filters.budget}
            onChange={(v) => patch({ budget: v })}
            options={options.budget}
            defaultValue="0"
          />
          <FilterDropdown
            label={t("rooms")}
            value={filters.rooms}
            onChange={(v) => patch({ rooms: v })}
            options={options.rooms}
            defaultValue="0"
          />
          <FilterDropdown
            label={t("surface")}
            value={filters.surfaceMin}
            onChange={(v) => patch({ surfaceMin: v })}
            options={options.surface}
            defaultValue="0"
          />

          <button
            type="button"
            onClick={() => patch({ exterior: !filters.exterior })}
            className={pillClass(filters.exterior)}
          >
            {t("exterior")}
          </button>
          <button
            type="button"
            onClick={() => patch({ elevator: !filters.elevator })}
            className={pillClass(filters.elevator)}
          >
            {t("elevator")}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={cn(
            "flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-foreground transition-colors",
            count ? "border-primary" : "border-input hover:border-primary",
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          <span>{t("allFilters")}</span>
          {count > 0 && (
            <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] text-primary-foreground">
              {count}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={reset}
          className="px-1.5 text-[13.5px] text-subtle underline underline-offset-2 hover:text-foreground"
        >
          {t("reset")}
        </button>
      </div>

      <AllFiltersDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        filters={filters}
        patch={patch}
        reset={reset}
        total={total}
      />
    </section>
  );
}
