"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { cn } from "@/lib/utils";
import type { ListingFilters } from "@/lib/types";
import type { DropdownOption } from "@/components/filter-dropdown";

interface AllFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ListingFilters;
  patch: (partial: Partial<ListingFilters>) => void;
  reset: () => void;
  total: number;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 font-mono text-[10px] uppercase text-subtle ltr:tracking-[0.14em]">
    {children}
  </p>
);

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[10px] border px-[15px] py-2 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground hover:border-primary"
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: DropdownOption[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option.value}
            active={String(option.value) === String(value)}
            onClick={() => onPick(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function AllFiltersDialog({
  open,
  onOpenChange,
  filters,
  patch,
  reset,
  total,
}: AllFiltersDialogProps) {
  const t = useTranslations("filters.modal");
  const tf = useTranslations("filters");
  const options = useFilterOptions();

  const switches = [
    {
      key: "exterior" as const,
      label: tf("exterior"),
      hint: t("exteriorHint"),
      value: filters.exterior,
    },
    {
      key: "elevator" as const,
      label: tf("elevator"),
      hint: t("elevatorHint"),
      value: filters.elevator,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-full max-w-[720px] gap-0 rounded-2xl p-0"
      >
        <div className="border-b border-border px-6 py-5">
          <DialogTitle className="text-lg font-bold tracking-[-0.01em]">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="mt-1 font-mono text-[11px] text-subtle">
            {t("count", { count: total })}
          </DialogDescription>
        </div>

        <div className="flex max-h-[62vh] flex-col gap-[26px] overflow-auto px-6 pb-2 pt-6">
          <div>
            <SectionLabel>{t("typeSection")}</SectionLabel>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
              {options.type.map((type) => {
                const on = filters.type === type.value;
                return (
                  <button
                    key={type.value || "all"}
                    type="button"
                    onClick={() => patch({ type: type.value })}
                    className={cn(
                      "flex flex-col items-start gap-2.5 rounded-xl border p-3.5 text-start transition-colors",
                      on
                        ? "border-primary bg-primary/[0.06]"
                        : "border-input bg-background hover:border-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "block size-[18px] rounded-[4px] border-[1.5px]",
                        on ? "border-primary" : "border-muted-foreground/50"
                      )}
                    />
                    <span className="text-[14.5px]">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ChipGroup
            title={t("groupProjet")}
            options={options.transaction}
            value={filters.transaction}
            onPick={(v) =>
              patch({ transaction: v as ListingFilters["transaction"] })
            }
          />
          <ChipGroup
            title={t("groupBudget")}
            options={options.budgetChips}
            value={filters.budget}
            onPick={(v) => patch({ budget: v })}
          />
          <ChipGroup
            title={t("groupRooms")}
            options={options.roomsChips}
            value={filters.rooms}
            onPick={(v) => patch({ rooms: v })}
          />
          <ChipGroup
            title={t("groupSurface")}
            options={options.surfaceChips}
            value={filters.surfaceMin}
            onPick={(v) => patch({ surfaceMin: v })}
          />

          <div>
            <SectionLabel>{t("criteria")}</SectionLabel>
            <div className="flex flex-col">
              {switches.map((sw) => (
                <div
                  key={sw.key}
                  className="flex items-center justify-between gap-4 border-t border-border py-3.5"
                >
                  <span>
                    <span className="block text-[15px]">{sw.label}</span>
                    <span className="mt-[3px] block text-[13px] text-subtle">
                      {sw.hint}
                    </span>
                  </span>
                  <Switch
                    checked={sw.value}
                    onCheckedChange={(checked) => patch({ [sw.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3.5 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {t("clearAll")}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-primary px-[26px] py-3 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {t("apply", { count: total })}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
