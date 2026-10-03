"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useListingFilters } from "@/hooks/use-listing-filters";
import { useListings } from "@/lib/queries";
import { activeFilterCount, DEFAULT_FILTERS } from "@/lib/filter";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { FilterBar } from "@/components/filter-bar";
import { ListingCard } from "@/components/listing-card";
import { FilterDropdown } from "@/components/filter-dropdown";
import { cn } from "@/lib/utils";

function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="flex flex-col gap-2 px-0.5 pt-3.5">
        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ResultsView() {
  const t = useTranslations("results");
  const tf = useTranslations("filters");
  const options = useFilterOptions();
  const { filters, patch, setFilters } = useListingFilters();
  const query = useListings(filters);

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const count = activeFilterCount(filters);

  const reset = () =>
    setFilters({
      ...DEFAULT_FILTERS,
      transaction: filters.transaction,
      sort: filters.sort,
    });

  const baseTitle =
    filters.transaction === "vente" ? t("titleVente") : t("titleLocation");
  const suffix = filters.q
    ? ` · ${filters.q}`
    : filters.region
      ? ` · ${filters.region}`
      : "";
  const resultsTitle = baseTitle + suffix;

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "700px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <FilterBar
        filters={filters}
        patch={patch}
        reset={reset}
        count={count}
        total={total}
      />

      <section className="mx-auto max-w-[1280px] px-7 pb-[70px] pt-[30px]">
        <div className="mb-[26px] flex flex-wrap items-baseline gap-3.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em]">
            {resultsTitle}
          </h1>
          <span className="font-mono text-xs text-subtle">
            {t("count", { count: total })}
          </span>
          <div className="ms-auto">
            <FilterDropdown
              label={tf("opt.sort.recent")}
              prefix={tf("sortPrefix")}
              value={filters.sort}
              onChange={(v) => patch({ sort: v as typeof filters.sort })}
              options={options.sort}
              defaultValue="recent"
              align="end"
            />
          </div>
        </div>

        {query.isError ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium">{t("errorTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("errorHint")}</p>
          </div>
        ) : query.isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-[70px] text-center">
            <p className="mb-2 text-xl font-medium">{t("noResultsTitle")}</p>
            <p className="mb-5 text-[14.5px] text-muted-foreground">
              {t("noResultsHint")}
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-input bg-background px-5 py-2.5 text-sm transition-colors hover:border-primary"
            >
              {t("noResultsReset")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-7">
            {items.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showCount
                priority={i < 3}
                animate
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div
            ref={sentinelRef}
            className="flex flex-col items-center gap-3.5 pt-10"
          >
            <span
              className={cn(
                "font-mono text-[11.5px] tracking-[0.06em] text-subtle",
                !isFetchingNextPage && "invisible"
              )}
            >
              {t("loadingNext")}
            </span>
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full border border-input bg-background px-[22px] py-2.5 text-sm transition-colors hover:border-primary disabled:opacity-50"
            >
              {t("loadMore")}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
