"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import bannerContent from "@/data/mjt-banner.json";

type BannerContent = {
  wordmarkTitle: string;
  statement: string[];
  ctas: Array<{ label: string; href: string }>;
};

const content = bannerContent as BannerContent;

export default function MjtBanner() {
  return (
    <section className="relative isolate left-1/2 w-screen -translate-x-1/2 bg-white/90 text-[color:var(--ink)] dark:bg-neutral-950/85 dark:text-neutral-100">
      <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-14 md:px-8">
        <div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">Content Starter</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] dark:text-neutral-50">
              {content.wordmarkTitle}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--ink)]/75 dark:text-neutral-300/90">
              {content.statement.join(" ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {content.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(242,92,39,0.3)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(242,92,39,0.35)]"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
