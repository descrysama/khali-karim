"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = { fr: "FR", ar: "ع" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: string) => {
    if (next === locale) return;
    const qs = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${pathname}${qs}`, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-current={loc === locale}
          className={cn(
            "rounded-full px-2.5 py-1 text-[13px] transition-colors",
            loc === locale
              ? "bg-primary text-primary-foreground"
              : "text-ink-soft hover:text-primary"
          )}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
