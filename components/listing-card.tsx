"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DPE_BG, photoUrl } from "@/lib/listings";
import {
  cardTitle,
  cityLabel,
  priceLabel,
  specs,
  zoneLabel,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { Listing } from "@/lib/types";
import { ListingPhoto } from "./listing-photo";

interface ListingCardProps {
  listing: Listing;
  showDpe?: boolean;
  showCount?: boolean;
  priority?: boolean;
  animate?: boolean;
}

export function ListingCard({
  listing,
  showDpe = false,
  showCount = false,
  priority = false,
  animate = false,
}: ListingCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("listing");
  const url = photoUrl(listing.type, listing.photoSeed, 800);
  const badge = listing.isNew
    ? t("badgeNew")
    : listing.transaction === "location"
      ? t("badgeLocation")
      : t("badgeVente");

  return (
    <Link
      href={`/annonce/${listing.id}`}
      className={cn(
        "group flex flex-col",
        animate &&
          "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
      )}
    >
      <ListingPhoto
        url={url}
        alt={cardTitle(listing, locale) + " · " + cityLabel(listing.city, locale)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        priority={priority}
        placeholder={t("terrainPlaceholder")}
        className="aspect-[4/3] transition-[border-radius] group-hover:rounded-3xl"
      >
        <span className="absolute start-3 top-3 flex gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ltr:tracking-[0.08em]",
              listing.isNew
                ? "bg-primary text-primary-foreground"
                : "bg-background/90 text-foreground"
            )}
          >
            {badge}
          </span>
          {showDpe && listing.hasEnergy && (
            <span
              dir="ltr"
              className={cn(
                "flex h-5 w-[22px] items-center justify-center rounded-[5px] font-mono text-[10px] font-bold text-white",
                DPE_BG[listing.dpe]
              )}
            >
              {listing.dpe}
            </span>
          )}
        </span>
        {showCount && (
          <span
            dir="ltr"
            className="absolute bottom-3 end-3 rounded-full bg-dark/70 px-2.5 py-[3px] font-mono text-[10.5px] text-white"
          >
            1 / {listing.photos}
          </span>
        )}
      </ListingPhoto>

      <div className="flex flex-col gap-1.5 px-0.5 pt-3.5">
        <strong className="text-xl tracking-[-0.01em]">
          {priceLabel(listing, locale)}
        </strong>
        <p className="text-[15px] font-medium">{cardTitle(listing, locale)}</p>
        <p className="text-[13.5px] text-muted-foreground">
          {specs(listing, locale)}
        </p>
        <p className="text-[13px] text-subtle">
          {zoneLabel(listing.zone, locale)}, {cityLabel(listing.city, locale)}
        </p>
      </div>
    </Link>
  );
}
