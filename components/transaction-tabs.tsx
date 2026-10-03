"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface TransactionTabsProps {
  value: Transaction;
  onChange: (value: Transaction) => void;
  className?: string;
}

export function TransactionTabs({
  value,
  onChange,
  className,
}: TransactionTabsProps) {
  const t = useTranslations("hero");
  const tabs: { value: Transaction; label: string }[] = [
    { value: "vente", label: t("tabVente") },
    { value: "location", label: t("tabLocation") },
  ];

  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-full bg-background p-[5px] shadow-[0_10px_30px_rgba(0,26,41,0.18)]",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-full px-10 py-3 text-sm font-medium tracking-[0.01em] transition-colors",
            value === tab.value
              ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(0,26,41,0.2)]"
              : "bg-background text-foreground hover:text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
