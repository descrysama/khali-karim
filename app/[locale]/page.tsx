import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeHero } from "@/components/home-hero";
import { ListingCard } from "@/components/listing-card";
import { LISTINGS } from "@/lib/listings";
import { cityLabel } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

const USER_CITY = "La Marsa";

function nearbyListings() {
  const near = LISTINGS.filter((it) => it.city === USER_CITY).slice(0, 3);
  return near.length >= 3 ? near : LISTINGS.slice(0, 3);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const nearby = nearbyListings();

  const stats = [
    { value: "312", label: t("statPortfolioLabel") },
    { value: "6", label: t("statGovernoratesLabel") },
    { value: "1998", label: t("statSinceLabel") },
    { value: t("statFirstVisitValue"), label: t("statFirstVisitLabel") },
  ];

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
              {t("nearbyTitle", { city: cityLabel(USER_CITY, locale as Locale) })}
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

        <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[26px]">
          {nearby.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-7 pb-24 pt-20">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border-y border-border bg-border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background px-6 py-[30px]">
              <p className="text-[30px] font-bold tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
