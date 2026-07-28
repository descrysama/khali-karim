import { DPE_BG, DPE_BG_SOFT, DPE_ORDER } from "@/lib/listings";
import { cn } from "@/lib/utils";
import type { DpeClass } from "@/lib/types";

export function DpeScale({ value }: { value: DpeClass }) {
  return (
    <div dir="ltr" className="flex items-center gap-1.5">
      {DPE_ORDER.map((letter) => {
        const active = letter === value;
        return (
          <div
            key={letter}
            className={cn(
              "flex-1 rounded-lg text-center font-mono font-bold",
              active
                ? cn("py-4 text-base text-white", DPE_BG[letter])
                : cn("py-2.5 text-xs text-foreground", DPE_BG_SOFT[letter])
            )}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
