import { Shapes } from "lucide-react";
import { useEffect, useState } from "react";

export type ShapeThumbnailSize = "compact" | "small" | "medium" | "large" | "compare";

type ShapeThumbnailProps = {
  src: string;
  name: string;
  size?: ShapeThumbnailSize;
  selected?: boolean;
  decorative?: boolean;
  className?: string;
};

const sizePixels: Record<ShapeThumbnailSize, number> = {
  compact: 24,
  small: 28,
  medium: 34,
  large: 40,
  compare: 48,
};

export default function ShapeThumbnail({
  src,
  name,
  size = "small",
  selected = false,
  decorative = false,
  className = "",
}: ShapeThumbnailProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const pixels = sizePixels[size];

  useEffect(() => setStatus("loading"), [src]);

  const handleError = () => {
    setStatus("error");
    if (import.meta.env.DEV) console.warn(`[ShapeThumbnail] Unable to load ${name}: ${src}`);
  };

  return (
    <span
      className={`shape-thumbnail shape-thumbnail-${size}${selected ? " is-selected" : ""} ${className}`.trim()}
      style={{ width: pixels, height: pixels }}
      data-state={status}
      data-testid={`shape-thumbnail-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {status === "loading" && <span className="shape-thumbnail-placeholder" aria-hidden="true" />}
      {status !== "error" && (
        <img
          src={src}
          alt={decorative ? "" : `${name} shape`}
          aria-hidden={decorative || undefined}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={handleError}
        />
      )}
      {status === "error" && <Shapes className="shape-thumbnail-fallback" aria-hidden="true" />}
    </span>
  );
}
