"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ListingPhoto } from "@/lib/types";

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: ListingPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function Lightbox({
  open,
  onOpenChange,
  photos,
  index,
  onIndexChange,
}: LightboxProps) {
  const t = useTranslations("lightbox");
  const len = photos.length;
  const step = (delta: number) => onIndexChange((index + delta + len) % len);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, len]);

  if (len === 0) return null;
  const current = photos[index];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[80] bg-black/[0.82] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-0 z-[80] flex flex-col px-[4vw] pb-6 pt-5 outline-none">
          <DialogPrimitive.Title className="sr-only">
            {t("close")}
          </DialogPrimitive.Title>

          <div className="flex flex-none items-center justify-between gap-4 px-1.5 pb-3.5">
            <span className="font-mono text-xs tracking-[0.06em] text-white/70">
              {index + 1} / {len}
              {current.alt ? ` · ${current.alt}` : ""}
            </span>
            <DialogPrimitive.Close className="flex size-[38px] items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15">
              <X className="size-4" />
              <span className="sr-only">{t("close")}</span>
            </DialogPrimitive.Close>
          </div>

          <div className="flex min-h-0 flex-1 items-stretch gap-3.5">
            <button
              type="button"
              onClick={() => step(-1)}
              className="flex size-10 flex-none self-center items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{t("prev")}</span>
            </button>

            <div className="relative mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 items-center justify-center">
              <Image
                src={current.url}
                alt={current.alt ?? ""}
                fill
                sizes="90vw"
                unoptimized
                className="rounded-xl object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              className="flex size-10 flex-none self-center items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">{t("next")}</span>
            </button>
          </div>

          <div className="flex flex-none justify-center gap-2.5 overflow-x-auto pt-4">
            {photos.map((photo, n) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onIndexChange(n)}
                className={cn(
                  "relative h-16 w-24 flex-none overflow-hidden rounded-lg bg-[#2b2338] outline-2 outline-offset-2 transition-opacity",
                  n === index
                    ? "opacity-100 outline-white"
                    : "opacity-60 outline-transparent hover:opacity-90"
                )}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
