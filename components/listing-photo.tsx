import Image from "next/image";
import { cn } from "@/lib/utils";

/** Hachure de remplacement (placeholder) reproduite en utilitaire Tailwind. */
export const HATCH =
  "bg-[repeating-linear-gradient(135deg,#27064a17_0px,#27064a17_2px,transparent_2px,transparent_12px)]";

interface ListingPhotoProps {
  url: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  className?: string;
  rounded?: string;
  children?: React.ReactNode;
}

export function ListingPhoto({
  url,
  alt,
  sizes,
  priority,
  placeholder = "[ photo à fournir ]",
  className,
  rounded = "rounded-2xl",
  children,
}: ListingPhotoProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted",
        rounded,
        !url && HATCH,
        className
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          className="object-cover"
        />
      ) : (
        <span className="px-3 text-center font-mono text-[10.5px] text-muted-foreground">
          {placeholder}
        </span>
      )}
      {children}
    </div>
  );
}
