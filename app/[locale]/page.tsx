import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeHero } from "@/components/home-hero";
import { ListingCard } from "@/components/listing-card";
import { getListings, getStats } from "@/lib/api";
import { fmtNumber } from "@/lib/content";
import type { Listing } from "@/lib/types";

// Sans ça, le fetch no-store échoue au build, est avalé par le try/catch et la
// home est figée sans annonces.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [latest, counts] = await Promise.all([
    getListings({ limit: 3 })
      .then((page) => page.items)
      .catch((): Listing[] => []),
    getStats(),
  ]);

  // Chiffres réels des annonces publiées ; bloc masqué tant qu'il n'y en a pas.
  const stats =
    counts && counts.total > 0
      ? [
          { value: counts.total, label: t("statTotal", { count: counts.total }) },
          { value: counts.vente, label: t("statVente") },
          { value: counts.location, label: t("statLocation") },
          { value: counts.cities, label: t("statCities", { count: counts.cities }) },
        ]
      : [];

  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-[1280px] px-7 pt-[72px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="mb-2.5 font-mono text-[11px] uppercase text-primary ltr:tracking-[0.16em]">
              {t("aroundYou")}
            </p>
            <h2 className="text-[30px] font-bold tracking-[-0.02em]">
              {t("latestTitle")}
            </h2>
          </div>
          <Link
            href="/recherche"
            className="inline-flex items-center gap-1.5 text-[14.5px] text-primary transition-colors hover:text-primary-hover"
          >
            {t("seeAll")}
            <span aria-hidden className="inline-block rtl:rotate-180">
              →
            </span>
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[26px]">
            {latest.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-border bg-muted/40 px-7 py-14 text-center">
            <p className="text-lg font-medium">{t("emptyTitle")}</p>
            <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
              {t("emptyHint")}
            </p>
          </div>
        )}
      </section>

      {stats.length > 0 ? (
        <section className="mx-auto max-w-[1280px] px-7 pb-24 pt-20">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border-y border-border bg-border">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background px-6 py-[30px]">
                <p className="text-[30px] font-bold tracking-[-0.02em]">
                  {fmtNumber(stat.value)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="pb-24" />
      )}
    </>
  );
}
