import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nepalart.space";
const siteName = "Nepal Art Space";
const defaultTitle = "Nepal Art Space | Contemporary Art & Cultural Events";
const defaultDescription =
  "Discover Nepal Art Space exhibitions, artist talks, and cultural events celebrating contemporary Nepali art and heritage.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "Nepal art",
    "Kathmandu gallery",
    "Nepali artists",
    "art exhibitions",
    "cultural events",
    "contemporary art",
    "South Asia art",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/portfolio.jpg",
        width: 1200,
        height: 630,
        alt: "Nepal Art Space exhibition preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/portfolio.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "arts",
  creator: siteName,
  publisher: siteName,
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: "#fffcf8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#fffcf8] text-[#1a1a1a]">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
