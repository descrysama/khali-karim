"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Phone, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { phoneDisplay, phoneHref } from "@/lib/agency";
import { useAgency } from "./agency-provider";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const agency = useAgency();
  const pathname = usePathname();
  // Menu ouvert pour une page donnée : il se referme tout seul après une
  // navigation, sans effet.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const closeMenu = () => setMenuPath(null);
  const nav = [
    { label: t("buy"), href: "/recherche" },
    { label: t("rent"), href: "/recherche?transaction=location" },
    { label: t("agency"), href: "/agence" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-4 sm:px-7 md:gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="block size-[22px] rounded bg-primary" />
          <span className="text-[19px] font-bold tracking-[-0.02em]">
            Al<span className="text-primary">tayssir</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="ms-auto hidden items-center gap-6 text-[14.5px] md:flex">
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
            href={phoneHref(agency.phone)}
            dir="ltr"
            className="flex items-center gap-2 rounded-full bg-primary px-[18px] py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {phoneDisplay(agency.phone)}
          </a>
        </nav>

        {/* Mobile */}
        <div className="ms-auto flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <a
            href={phoneHref(agency.phone)}
            aria-label={phoneDisplay(agency.phone)}
            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Phone className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block border-b border-border py-3.5 text-[15px] text-foreground last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={phoneHref(agency.phone)}
            dir="ltr"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-[18px] py-3 font-medium text-primary-foreground"
          >
            <Phone className="size-4" />
            {phoneDisplay(agency.phone)}
          </a>
        </nav>
      )}
    </header>
  );
}
