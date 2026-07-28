"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Valeur considérée « non active » (ex. "" ou "0"). */
  defaultValue?: string;
  variant?: "pill" | "plain";
  align?: "start" | "end";
  prefix?: string;
  triggerClassName?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  defaultValue = "",
  variant = "pill",
  align = "start",
  prefix,
  triggerClassName,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const active = String(value) !== String(defaultValue);
  const selected = options.find((o) => String(o.value) === String(value));
  const buttonLabel = active && selected ? selected.label : label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex cursor-pointer items-center transition-colors outline-none",
          variant === "pill" &&
            cn(
              "gap-1.5 rounded-full border px-3.5 py-2 text-sm",
              active
                ? "border-primary bg-primary/[0.07] text-primary-hover"
                : open
                  ? "border-primary bg-background text-foreground"
                  : "border-input bg-background text-foreground hover:border-primary"
            ),
          variant === "plain" &&
            "w-full justify-between gap-2.5 px-5 py-[15px] text-start text-[15px] text-foreground",
          triggerClassName
        )}
      >
        {prefix && <span className="text-[13px] text-subtle">{prefix}</span>}
        <span className={variant === "plain" ? "truncate" : undefined}>
          {buttonLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            open && "rotate-180",
            active ? "text-primary-hover" : "text-subtle",
            variant === "plain" && "ms-auto"
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        className="flex w-auto min-w-[220px] flex-col gap-0.5 rounded-2xl p-1.5"
      >
        {options.map((option) => {
          const isSelected = String(option.value) === String(value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
                isSelected
                  ? "bg-primary/[0.08] text-primary-hover"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <span>{option.label}</span>
              <Check
                className={cn(
                  "size-3.5 text-primary transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
