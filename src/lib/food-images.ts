import { useMemo } from "react";

// Vite-friendly resolver for images referenced as strings in the foods DB.
// Supports values like:
// - "/src/assets/food-images/apple.png"
// - "src/assets/food-images/apple.png"
// - "apple.png"
// - already-built URLs (http/data/blob)

const imageModules = import.meta.glob("../assets/food-images/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function resolveFoodImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;

  // Already a usable URL
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  const filename = imageUrl.split("/").pop();
  if (!filename) return null;

  const matchKey = Object.keys(imageModules).find((k) => k.endsWith(`/${filename}`));
  return matchKey ? imageModules[matchKey] : null;
}

export function useResolvedFoodImageUrl(imageUrl?: string | null) {
  return useMemo(() => resolveFoodImageUrl(imageUrl), [imageUrl]);
}
