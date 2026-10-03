import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cn } from "@/lib/utils";
import { HATCH } from "@/components/listing-photo";
import { getAgency, phoneDisplay, phoneHref } from "@/lib/agency";
import type { Locale } from "@/i18n/routing";

export default async function AgencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agence");
  const agency = await getAgency(locale as Locale);

  const rows = [
    { label: t("rowAddress"), value: agency.address },
    { label: t("rowHours"), value: agency.hours },
    { label: t("rowEmail"), value: agency.email },
  ];

  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[60px] px-7 pb-[90px] pt-[70px]">
      <div>
        <p className="mb-3.5 font-mono text-[11px] uppercase text-primary ltr:tracking-[0.16em]">
          {t("label")}
        </p>
        <h1 className="max-w-[20ch] text-[clamp(30px,4vw,44px)] font-bold leading-[1.06] tracking-[-0.03em]">
          {agency.headline}
        </h1>
        {agency.intro && (
          <p className="mt-5 max-w-[48ch] whitespace-pre-line text-base leading-[1.65] text-ink-soft">
            {agency.intro}
          </p>
        )}
        <a
          href={phoneHref(agency.phone)}
          className="mt-[30px] inline-flex items-center rounded-full bg-primary px-[26px] py-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("callCta", { phone: phoneDisplay(agency.phone) })}
        </a>

        <div className="mt-10 grid max-w-[420px] gap-[22px]">
          {rows.map((row) => (
            <div key={row.label} className="border-t border-border pt-4">
              <p className="mb-1.5 font-mono text-[10px] uppercase text-subtle ltr:tracking-[0.13em]">
                {row.label}
              </p>
              <p className="text-[15px]">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {agency.photoUrl ? (
        <div className="relative min-h-[460px] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={agency.photoUrl}
            alt={agency.name}
            fill
            sizes="(min-width: 1280px) 600px, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex min-h-[460px] items-center justify-center rounded-2xl bg-muted",
            HATCH
          )}
        >
          <span className="font-mono text-[11px] text-muted-foreground">
            {t("photoPlaceholder")}
          </span>
        </div>
      )}
    </section>
  );
}
