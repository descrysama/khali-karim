"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-border bg-background px-7 py-[34px]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5">
        <span className="text-sm font-medium">{t("tagline")}</span>
        <span className="font-mono text-[11px] text-subtle">{t("legal")}</span>
      </div>
    </footer>
  );
}
