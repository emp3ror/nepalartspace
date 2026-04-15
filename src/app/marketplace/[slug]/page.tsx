import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getArtworkBySlug, getArtworkSlugs } from "@/lib/marketplace";

type ArtworkPageProps = {
  params: Promise<{ slug: string }>;
};

const formatAuctionEnd = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));

export const generateStaticParams = async () =>
  getArtworkSlugs().map((slug) => ({ slug }));

export const dynamicParams = false;

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    return {};
  }

  return {
    title: artwork.title,
    description: artwork.summary,
    alternates: {
      canonical: `/marketplace/${artwork.slug}`,
    },
    openGraph: {
      title: artwork.title,
      description: artwork.summary,
      url: `/marketplace/${artwork.slug}`,
      images: [
        {
          url: artwork.image,
          alt: artwork.title,
        },
      ],
    },
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const isAuction = artwork.saleType === "auction";

  return (
    <main className="min-h-screen bg-[#fffcf8] text-[#1a1a1a]">
      <article className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-10 md:px-8 md:pt-14">
        <nav className="text-sm text-[#666]">
          <Link href="/marketplace" className="transition hover:text-[#b5791b]">
            ← Back to marketplace
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#eadfcd] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <Image src={artwork.image} alt={artwork.title} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7d6a48]">
                <span className="rounded-full bg-[#fff3d6] px-3 py-1">{isAuction ? "Auction lot" : "Fixed price"}</span>
                <span>{artwork.year}</span>
                <span>{artwork.location}</span>
              </div>

              <div className="space-y-2">
                <p className="text-base text-[#666]">{artwork.artist}</p>
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{artwork.title}</h1>
                <p className="max-w-2xl text-base leading-7 text-[#666]">{artwork.summary}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfcd] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">Medium</p>
                  <p className="mt-2 text-sm text-[#1a1a1a]">{artwork.medium}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">Dimensions</p>
                  <p className="mt-2 text-sm text-[#1a1a1a]">{artwork.dimensions}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">{isAuction ? "Current bid" : "Price"}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">
                    {isAuction ? artwork.currentBid : artwork.price}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">
                    {isAuction ? "Auction closes" : "Availability"}
                  </p>
                  <p className="mt-2 text-sm text-[#1a1a1a]">
                    {isAuction && artwork.auctionEndsAt ? formatAuctionEnd(artwork.auctionEndsAt) : "Available for inquiry"}
                  </p>
                </div>
              </div>

              {isAuction ? (
                <p className="mt-5 text-sm text-[#666]">{artwork.bidCount} bids recorded. Contact Nepal Art Space to register or place a new bid.</p>
              ) : (
                <p className="mt-5 text-sm text-[#666]">This artwork is available for direct acquisition through Nepal Art Space.</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-[#fffcf8] transition hover:bg-[#b5791b]"
                >
                  {isAuction ? "Request bidding details" : "Inquire to purchase"}
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:border-[#b5791b] hover:text-[#b5791b]"
                >
                  Browse more works
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfcd] bg-[#fff9ef] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">Highlights</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#4a4033]">
                {artwork.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[2rem] border border-[#eadfcd] bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">About the work</p>
            <div className="mt-5 space-y-4 text-base leading-8 text-[#4a4033]">
              {artwork.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#eadfcd] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7d6a48]">Collector notes</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#4a4033]">
              <p>All listed works are presented as original pieces from the Nepal Art Space program.</p>
              <p>Pricing, bids, and availability can be adjusted later by replacing the sample dataset with CMS or API content.</p>
              <p>The current detail page structure is already set up for that future migration.</p>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
