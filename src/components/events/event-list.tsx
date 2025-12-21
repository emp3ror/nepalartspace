"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookmarkPlus } from "lucide-react";

import { formatEventDateRange } from "@/lib/events";
import type { MdxEvent } from "@/lib/mdx-events";

type DisplayEvent = {
  _id: string;
  title: string;
  location?: string;
  description?: string;
  price?: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  cover?: string;
  url?: string;
  featured?: boolean;
};

type EventListProps = {
  events?: MdxEvent[];
  fallbackEvents?: DisplayEvent[];
  showBreadcrumb?: boolean;
};


const toDisplayEvent = (event: MdxEvent): DisplayEvent => ({
  _id: event._id,
  title: event.title,
  location: event.location,
  description: event.description,
  price: undefined,
  date: event.date,
  endDate: event.endDate,
  startTime: event.startTime ?? undefined,
  endTime: event.endTime ?? undefined,
  cover: event.cover,
  url: event.url,
  featured: false,
});

const formatDateRange = (event: DisplayEvent) => {
  return formatEventDateRange({
    date: event.date,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
  });
};

export function EventList({ events = [], fallbackEvents, showBreadcrumb = true }: EventListProps) {
  const sourceEvents = useMemo<DisplayEvent[]>(() => {
    if (events.length === 0) return fallbackEvents ?? [];

    return [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(toDisplayEvent);
  }, [events, fallbackEvents]);

  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return sourceEvents;
    return sourceEvents.filter((event) => {
      const haystack = `${event.title} ${event.location ?? ""} ${event.description ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [searchValue, sourceEvents]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchValue(query);
  };

  const hasEvents = sourceEvents.length > 0;

  return (
    <section id="upcoming-events" className="w-full bg-[#fffcf8]">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-8" id="breadcrumb">
        {showBreadcrumb ? (
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#666]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#1a1a1a]">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-[#1a1a1a]">Events</span>
          </nav>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#666]">Events</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">Upcoming events</h2>
            <p className="text-sm text-[#666]">Search events or keep these placeholders until your content is ready.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={onSubmit} className="flex items-center gap-3 rounded-full bg-[#f9f6f0] px-3 py-2">
              <input
                type="search"
                placeholder="Search for events"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-full bg-transparent px-3 py-2 text-sm text-[#1a1a1a] outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#fcd68a] px-4 py-2 text-xs font-semibold text-[#1a1a1a]"
              >
                Find Events
              </button>
            </form>
            <a
              href="/events/calendar"
              className="inline-flex items-center gap-2 rounded-full bg-[#fcd68a] px-5 py-3 text-sm font-semibold text-[#1a1a1a] shadow-[0_14px_32px_rgba(242,214,138,0.35)] transition hover:-translate-y-0.5"
              download="events.ics"
            >
              Subscribe to calendar <BookmarkPlus className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        <div className="grid gap-12" id="event-articles">
          {filtered.length > 0 ? (
            filtered.map((event) => (
              <article key={event._id} className="grid gap-8 md:grid-cols-[80px_1fr_280px] md:items-start">
                <div className="text-center font-sans" id="event-date">
                  <div className="text-lg font-medium text-[#1a1a1a]">
                    {new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(event.date))}
                  </div>
                  <div className="mt-1 text-2xl font-normal text-[#1a1a1a]">
                    {new Date(event.date).getDate()}
                  </div>
                </div>

                <div className={`space-y-3 ${event.featured ? "border-l-4 border-[#fcd68a] pl-6" : "pl-6"}`}>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#666]">
                    {event.featured ? <span className="rounded bg-[#fff6e0] px-3 py-1 text-[#8a6d3b]">Featured</span> : null}
                    <span className="text-[#666]">{String(formatDateRange(event))}</span>
                  </div>
                  <h3 className="font-sans text-2xl font-normal text-[#1a1a1a]">
                    <Link href={event.url ?? "/events"} className="transition hover:text-[#c08a2e]">
                      {event.title}
                    </Link>
                  </h3>
                  {event.location ? <div className="text-sm font-semibold text-[#1a1a1a]">{event.location}</div> : null}
                  {event.description ? <p className="text-sm text-[#666]">{event.description}</p> : null}
                  {event.price ? <div className="text-2xl font-normal text-[#1a1a1a]">{event.price}</div> : null}
                </div>

                <div className="relative h-full min-h-[180px] overflow-hidden rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
                  <Link href={event.url ?? "/events"} aria-label={`${event.title} details`}>
                    {event.cover ? (
                      <Image
                        src={event.cover}
                        alt={event.title}
                        fill
                        sizes="(min-width: 1024px) 280px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#fff6e0] text-sm text-[#666]">Add an image</div>
                    )}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#d7d0c4] bg-white px-6 py-12 text-center text-sm text-[#666] shadow-[0_6px_18px_rgba(0,0,0,0.04)] md:px-10">
              <p className="text-lg font-semibold text-[#1a1a1a]">
                {hasEvents ? "No events match your search" : "No events yet"}
              </p>
              <p className="mt-2">
                {hasEvents
                  ? "Try a different term or clear the search box."
                  : (
                    <>
                      Add MDX files under{" "}
                      <code className="rounded bg-[#f5f2ec] px-2 py-1 text-xs text-[#1a1a1a]">content/events</code>{" "}
                      and they will appear here automatically.
                    </>
                  )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
