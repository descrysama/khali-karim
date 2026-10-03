"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useListing } from "@/lib/queries";
import {
  cityLabel,
  description,
  detailTitle,
  facts,
  legalLine,
  placeLabel,
  priceLabel,
  refLabel,
  unitLabel,
  zoneLabel,
} from "@/lib/content";
import { ListingCard } from "@/components/listing-card";
import { ListingPhoto, HATCH } from "@/components/listing-photo";
import { Lightbox } from "@/components/lightbox";
import { phoneDisplay, phoneHref } from "@/lib/agency";
import { useAgency } from "@/components/agency-provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-[1280px] px-7 pb-20 pt-[22px]">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[2.1fr_1fr]">
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-muted" />
        <div className="hidden gap-2.5 sm:grid">
          <div className="animate-pulse rounded-2xl bg-muted" />
          <div className="animate-pulse rounded-2xl bg-muted" />
          <div className="animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
      <div className="mt-10 h-10 w-2/3 max-w-lg animate-pulse rounded bg-muted" />
      <div className="mt-4 h-6 w-40 animate-pulse rounded bg-muted" />
    </section>
  );
}

export function ListingDetail({ id }: { id: string }) {
  const t = useTranslations("detail");
  const agency = useAgency();
  const tListing = useTranslations("listing");
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useListing(id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <section className="mx-auto max-w-[1280px] px-7 py-24 text-center">
        <p className="text-xl font-medium">{t("notFoundTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("notFoundHint")}</p>
        <Link
          href="/recherche"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("notFoundBack")}
        </Link>
      </section>
    );
  }

  const { listing: d, similar } = data;
  const photos = d.photos;
  const hasPhotos = photos.length > 0;
  const thumbs = photos.slice(1, 4);
  const placeholder = d.isLand
    ? tListing("terrainPlaceholder")
    : tListing("photoPlaceholder");
  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };
  const zoneOrCity = zoneLabel(d.zone, locale) || cityLabel(d.city, locale);

  return (
    <section className="mx-auto max-w-[1280px] px-7 pb-20 pt-[22px]">
      <Link
        href="/recherche"
        className="mb-[18px] inline-flex items-center gap-1.5 text-[13.5px] text-subtle transition-colors hover:text-foreground"
      >
        <span aria-hidden className="inline-block rtl:rotate-180">
          ←
        </span>
        {t("back")}
      </Link>

      {/* Galerie */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[2.1fr_1fr]">
        <div
          role={hasPhotos ? "button" : undefined}
          tabIndex={hasPhotos ? 0 : undefined}
          onClick={() => hasPhotos && openLightbox(0)}
          onKeyDown={(e) => hasPhotos && e.key === "Enter" && openLightbox(0)}
          className={hasPhotos ? "cursor-zoom-in" : undefined}
        >
          <ListingPhoto
            url={photos[0]?.url ?? null}
            alt={detailTitle(d, locale)}
            sizes="(max-width: 640px) 100vw, 66vw"
            priority
            placeholder={placeholder}
            className="h-[300px] sm:h-[460px]"
          >
            {hasPhotos && (
              <span className="absolute bottom-3.5 end-3.5 rounded-full bg-background/95 px-4 py-2 text-[13.5px] font-medium text-foreground shadow-sm">
                {t("photoCount", { count: photos.length })}
              </span>
            )}
          </ListingPhoto>
        </div>

        {thumbs.length > 0 && (
          <div className="hidden grid-rows-3 gap-2.5 sm:grid">
            {thumbs.map((photo, i) => (
              <div
                key={photo.id}
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(i + 1)}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(i + 1)}
                className="cursor-zoom-in"
              >
                <ListingPhoto
                  url={photo.url}
                  alt={photo.alt ?? ""}
                  sizes="33vw"
                  placeholder={placeholder}
                  className="h-full min-h-[100px]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenu + aside */}
      <div className="mt-10 grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase text-primary ltr:tracking-[0.16em]">
            {refLabel(d, locale)}
          </p>
          <h1 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.1] tracking-[-0.03em]">
            {detailTitle(d, locale)}
          </h1>
          <p className="mt-2.5 text-[15px] text-muted-foreground">
            {placeLabel(d, locale)}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
            <strong className="text-[34px] tracking-[-0.03em]">
              {priceLabel(d, locale)}
            </strong>
            {unitLabel(d, locale) && (
              <span className="font-mono text-[12.5px] text-subtle">
                {unitLabel(d, locale)}
              </span>
            )}
          </div>

          <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-6 border-y border-border py-6">
            {facts(d, locale).map((fact) => (
              <div key={fact.k}>
                <p className="mb-[7px] font-mono text-[10px] uppercase text-subtle ltr:tracking-[0.13em]">
                  {fact.k}
                </p>
                <p className="text-[15.5px] font-medium">{fact.v}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-9 text-xl font-bold tracking-[-0.01em]">
            {t("sectionBien")}
          </h2>
          <p className="text-pretty text-[15.5px] leading-[1.68] text-ink-soft">
            {description(d, locale)}
          </p>

          <h2 className="mb-3.5 mt-9 text-xl font-bold tracking-[-0.01em]">
            {t("sectionQuartier")}
          </h2>
          <div
            className={cn(
              "flex h-[280px] items-center justify-center rounded-2xl bg-muted",
              HATCH
            )}
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {t("mapPlaceholder", {
                zone: zoneOrCity,
                city: cityLabel(d.city, locale),
              })}
            </span>
          </div>
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-[92px]">
          <div className="rounded-2xl border border-border p-6">
            <a
              href={phoneHref(agency.phone)}
              className="flex items-center justify-center rounded-xl bg-primary p-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("callAgency")}
            </a>
            <p className="mt-3 text-center font-mono text-xs text-subtle">
              {t("hoursLine", {
                phone: phoneDisplay(agency.phone),
                hours: agency.hours,
              })}
            </p>
            <Link
              href="/agence"
              className="mt-3.5 flex w-full items-center justify-center rounded-xl border border-input p-3.5 text-[14.5px] transition-colors hover:border-primary"
            >
              {t("requestVisit")}
            </Link>
          </div>
          <p className="mx-1 font-mono text-[11px] leading-[1.6] text-subtle">
            {legalLine(d, locale)}
          </p>
        </aside>
      </div>

      {/* Biens similaires */}
      {similar.length > 0 && (
        <div className="mt-[70px] border-t border-border pt-8">
          <h2 className="mb-[22px] text-[22px] font-bold tracking-[-0.02em]">
            {t("sectionSimilar")}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[26px]">
            {similar.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      )}

      {hasPhotos && (
        <Lightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          photos={photos}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
        />
      )}
    </section>
  );
}
