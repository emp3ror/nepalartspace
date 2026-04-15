export type ArtworkSaleType = "fixed" | "auction";

export type Artwork = {
  slug: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  location: string;
  image: string;
  saleType: ArtworkSaleType;
  price?: string;
  currentBid?: string;
  bidCount?: number;
  auctionEndsAt?: string;
  status: "available" | "live-auction" | "sold";
  summary: string;
  description: string[];
  highlights: string[];
};

const artworks: Artwork[] = [
  {
    slug: "himalayan-memory",
    title: "Himalayan Memory",
    artist: "Sanjog Shrestha",
    year: "2024",
    medium: "Acrylic, gold leaf, and charcoal on canvas",
    dimensions: "122 x 91 cm",
    location: "Kathmandu",
    image: "/portfolio.jpg",
    saleType: "fixed",
    price: "$1,450",
    status: "available",
    summary: "Layered mountain forms and handwritten fragments reflect memory, migration, and devotional landscapes.",
    description: [
      "Built from soft ochre washes and dark gesture lines, this work studies how memory changes the outline of place.",
      "Gold leaf appears in broken fields across the surface, echoing paubha ornament while staying grounded in a contemporary abstract language.",
    ],
    highlights: ["Certificate of authenticity included", "Framed in natural ash wood", "Ready for local pickup or insured delivery"],
  },
  {
    slug: "courtyard-echoes",
    title: "Courtyard Echoes",
    artist: "Asha Maharjan",
    year: "2025",
    medium: "Mixed media on handmade lokta paper",
    dimensions: "76 x 56 cm",
    location: "Patan",
    image: "/a.jpg",
    saleType: "auction",
    currentBid: "$820",
    bidCount: 12,
    auctionEndsAt: "2026-04-20T18:00:00+05:45",
    status: "live-auction",
    summary: "Textured paper, pigment, and stitched thread translate Newa courtyard rhythms into a tactile contemporary composition.",
    description: [
      "The artist works directly on lokta paper, building surface density through mineral pigment, thread, and graphite marks.",
      "This piece balances architectural repetition with intimate handmade variation, giving it both urban structure and personal warmth.",
    ],
    highlights: ["Live bidding open this week", "Includes artist note", "One-of-one original work"],
  },
  {
    slug: "monsoon-passage",
    title: "Monsoon Passage",
    artist: "Pratik Rai",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: "140 x 100 cm",
    location: "Bhaktapur",
    image: "/123.png",
    saleType: "fixed",
    price: "$2,100",
    status: "available",
    summary: "A rain-soaked urban scene rendered in thick oil layers, balancing traffic glow with monsoon haze.",
    description: [
      "Broad knife strokes create a wet reflective street surface, while compressed areas of light suggest movement without locking into realism.",
      "The palette stays close to earth and storm tones, then opens in small passages of amber and pale blue.",
    ],
    highlights: ["Signed on verso", "Suitable for large wall display", "Studio viewing available by appointment"],
  },
  {
    slug: "ritual-flame-study",
    title: "Ritual Flame Study",
    artist: "Meera Tamang",
    year: "2025",
    medium: "Natural pigment and ink on cotton",
    dimensions: "90 x 70 cm",
    location: "Kathmandu",
    image: "/portfolio.jpg",
    saleType: "auction",
    currentBid: "$1,080",
    bidCount: 7,
    auctionEndsAt: "2026-04-18T16:30:00+05:45",
    status: "live-auction",
    summary: "A study of ceremonial light using repeated flame motifs, hand-ground pigment, and precise ink geometry.",
    description: [
      "The painting uses a restrained composition, with repeated luminous forms emerging from a muted red-brown field.",
      "Traditional material choices meet a highly edited contemporary layout, creating a work that feels devotional without becoming illustrative.",
    ],
    highlights: ["Auction closes soon", "Natural pigment process", "Collector framing available on request"],
  },
];

export function getAllArtworks() {
  return artworks;
}

export function getArtworkSlugs() {
  return artworks.map((artwork) => artwork.slug);
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}
