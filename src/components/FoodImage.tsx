import { useState } from "react";
import { cn } from "@/lib/utils";
import { useResolvedFoodImageUrl } from "@/lib/food-images";

type FoodImageProps = {
  imageUrl?: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  loading?: "lazy" | "eager";
};

export default function FoodImage({
  imageUrl,
  alt,
  fallback,
  className,
  loading = "lazy",
}: FoodImageProps) {
  const resolved = useResolvedFoodImageUrl(imageUrl);
  const [failed, setFailed] = useState(false);

  const src = resolved ?? imageUrl ?? null;
  const showImg = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showImg ? (
        <img
          src={src as string}
          alt={alt}
          loading={loading}
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="h-full w-full flex items-center justify-center"
          role="img"
          aria-label={alt}
        >
          {fallback}
        </div>
      )}
    </div>
  );
}
