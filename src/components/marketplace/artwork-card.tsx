import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/card";
import type { Artwork } from "@/lib/marketplace";

type ArtworkCardProps = {
  artwork: Artwork;
};

const statusLabel: Record<Artwork["status"], string> = {
  available: "Available",
  "live-auction": "Live auction",
  sold: "Sold",
};

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const priceLabel = artwork.saleType === "auction" ? `Current bid ${artwork.currentBid}` : artwork.price;

  return (
    <Card className="group flex h-full flex-col gap-5 overflow-hidden border border-[#eadfcd] bg-white p-0">
      <Link href={`/marketplace/${artwork.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={artwork.image}
          alt={artwork.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7d6a48]">
          <span className="rounded-full bg-[#fff3d6] px-3 py-1">{artwork.saleType === "auction" ? "Auction" : "For sale"}</span>
          <span>{statusLabel[artwork.status]}</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[#666]">
            {artwork.artist} · {artwork.year}
          </p>
          <Link
            href={`/marketplace/${artwork.slug}`}
            className="block text-2xl font-semibold leading-tight text-[#1a1a1a] transition hover:text-[#b5791b]"
          >
            {artwork.title}
          </Link>
          <p className="text-sm leading-6 text-[#666]">{artwork.summary}</p>
        </div>

        <div className="grid gap-2 text-sm text-[#4a4033]">
          <div className="flex items-center justify-between gap-4">
            <span>{artwork.medium}</span>
            <span className="whitespace-nowrap text-right font-semibold text-[#1a1a1a]">{priceLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#666]">
            <span>{artwork.dimensions}</span>
            <span>{artwork.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/marketplace/${artwork.slug}`}
            className="inline-flex items-center rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#fffcf8] transition hover:bg-[#b5791b]"
          >
            View details
          </Link>
        </div>
      </div>
    </Card>
  );
}
