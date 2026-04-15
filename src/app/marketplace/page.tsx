import type { Metadata } from "next";

import { ArtworkGrid } from "@/components/marketplace/artwork-grid";
import { SectionHeading } from "@/components/section-heading";
import { getAllArtworks } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse available contemporary artworks and live auction listings from Nepal Art Space.",
  alternates: {
    canonical: "/marketplace",
  },
};

export default function MarketplacePage() {
  const artworks = getAllArtworks();
  const fixedPriceWorks = artworks.filter((artwork) => artwork.saleType === "fixed");
  const auctionWorks = artworks.filter((artwork) => artwork.saleType === "auction");

  return (
    <main className="min-h-screen bg-[#fffcf8] text-[#1a1a1a]">
      <section className="border-b border-[#eadfcd] bg-[radial-gradient(circle_at_top_left,_rgba(252,214,138,0.35),_transparent_45%),linear-gradient(180deg,_#fff8ec_0%,_#fffcf8_100%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:px-8 md:py-20">
          <SectionHeading
            eyebrow="Marketplace"
            title="Collect original works and follow live auctions"
            description="Explore curated paintings, mixed-media pieces, and limited auction lots. Every artwork opens to a dedicated detail page with pricing, artist context, and sale information."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] border border-[#eadfcd] bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7d6a48]">Available now</p>
              <p className="mt-3 text-3xl font-semibold text-[#1a1a1a]">{fixedPriceWorks.length}</p>
              <p className="mt-2 text-sm text-[#666]">Ready to purchase directly from the collection.</p>
            </div>
            <div className="rounded-[2rem] border border-[#eadfcd] bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7d6a48]">Live auctions</p>
              <p className="mt-3 text-3xl font-semibold text-[#1a1a1a]">{auctionWorks.length}</p>
              <p className="mt-2 text-sm text-[#666]">Actively accepting bids with visible current pricing.</p>
            </div>
            <div className="rounded-[2rem] border border-[#eadfcd] bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7d6a48]">Curated focus</p>
              <p className="mt-3 text-3xl font-semibold text-[#1a1a1a]">Nepal</p>
              <p className="mt-2 text-sm text-[#666]">Contemporary works rooted in local material and visual culture.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 md:px-8">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="For Sale"
            title="Direct purchase works"
            description="Original pieces with fixed pricing for collectors who want immediate acquisition."
          />
          <ArtworkGrid artworks={fixedPriceWorks} />
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="Auctions"
            title="Current bidding lots"
            description="Auction listings show the current bid and route into a dedicated detail view for the work."
          />
          <ArtworkGrid artworks={auctionWorks} />
        </div>
      </section>
    </main>
  );
}
