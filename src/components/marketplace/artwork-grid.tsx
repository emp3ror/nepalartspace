import { ArtworkCard } from "@/components/marketplace/artwork-card";
import type { Artwork } from "@/lib/marketplace";

type ArtworkGridProps = {
  artworks: Artwork[];
};

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.slug} artwork={artwork} />
      ))}
    </div>
  );
}
