"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AGENCY } from "@/lib/agency";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const nav = [
    { label: t("buy"), href: "/recherche" },
    { label: t("rent"), href: "/recherche?transaction=location" },
    { label: t("agency"), href: "/agence" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-7 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="block size-[22px] rounded bg-primary" />
          <span className="text-[19px] font-bold tracking-[-0.02em]">
            Dar<span className="text-primary">Nour</span>
          </span>
        </Link>
        <nav className="ms-auto flex items-center gap-6 text-[14.5px]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-soft transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <a
            href={AGENCY.phoneHref}
            dir="ltr"
            className="flex items-center gap-2 rounded-full bg-primary px-[18px] py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {AGENCY.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
