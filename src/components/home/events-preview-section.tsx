import Image from "next/image";
import Link from "next/link";
import { BookmarkPlus, CalendarDays, MapPin } from "lucide-react";

import { normalizeEventDates } from "@/lib/events";
import type { MdxEvent } from "@/lib/mdx-events";

type DisplayEvent = Pick<
  MdxEvent,
  "title" | "description" | "date" | "endDate" | "startTime" | "endTime" | "location" | "category" | "cover" | "url" | "registrationUrl" | "_id" | "slug"
>;

const placeholderEvents: DisplayEvent[] = [
  {
    _id: "placeholder-1",
    slug: "placeholder-1",
    title: "Street Food Festival",
    description: "A relaxed afternoon packed with food trucks, music, and local makers.",
    date: "2024-10-01",
    endDate: "2024-10-01",
    startTime: "10:00",
    endTime: "18:00",
    location: "Downtown Plaza, Your City",
    category: "Food",
    cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    registrationUrl: "#",
    url: "/events",
  },
  {
    _id: "placeholder-2",
    slug: "placeholder-2",
    title: "Park Concert Series",
    description: "Live music in the park with cozy lighting and a picnic-friendly lawn.",
    date: "2024-10-04",
    endDate: "2024-10-04",
    startTime: "17:00",
    endTime: "20:00",
    location: "Riverside Park",
    category: "Music",
    cover: "https://images.unsplash.com/photo-1470225632657-013b6e56c1d5?auto=format&fit=crop&w=900&q=80",
    registrationUrl: "#",
    url: "/events",
  },
  {
    _id: "placeholder-3",
    slug: "placeholder-3",
    title: "Autumn Art Showcase",
    description: "Gallery night featuring emerging illustrators, printmakers, and installation artists.",
    date: "2024-10-12",
    endDate: "2024-10-12",
    startTime: "18:30",
    endTime: "21:30",
    location: "Third Street Gallery",
    category: "Art",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    registrationUrl: "#",
    url: "/events",
  },
];

type EventsPreviewSectionProps = {
  events: DisplayEvent[];
};

const formatDateRange = (event: DisplayEvent) => {
  const { startLabel, endLabel } = normalizeEventDates({
    date: event.date,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
  });

  if (startLabel === endLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
};

export function EventsPreviewSection({ events }: EventsPreviewSectionProps) {
  const source = events.length > 0 ? events : placeholderEvents;

  return (
    <section id="upcoming-events" className="w-full bg-white">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A1A6C8]">Events</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#d95f5b]">Upcoming events</h2>
            <p className="text-sm text-[#7a7ea8]">Drop your MDX files in `content/events` or keep these placeholders.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Search for events"
              className="h-11 rounded-full border border-[#e3e7f2] bg-white px-4 text-sm text-[#6c6f90] shadow-[0_8px_24px_rgba(60,62,112,0.08)] focus:outline-none"
            />
            <Link
              href="#subscribe"
              className="inline-flex items-center gap-2 rounded-full bg-[#f27f6c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(242,127,108,0.3)] transition hover:-translate-y-0.5"
            >
              Subscribe to calendar
              <BookmarkPlus className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {source.map((event) => (
            <article
              key={event._id}
              className="grid gap-4 rounded-[1.75rem] border border-[#edf0f7] bg-white p-6 shadow-[0_24px_46px_rgba(77,86,125,0.12)] md:grid-cols-[120px_1fr_220px] md:items-center"
            >
              <div className="flex items-center gap-3 text-left text-xs uppercase tracking-[0.24em] text-[#A1A6C8]">
                <div className="text-left">
                  <div className="text-[0.7rem]">
                    {new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(event.date))}
                  </div>
                  <div className="text-3xl font-semibold text-[#6e72a0]">{new Date(event.date).getDate()}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#A1A6C8]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f9e3dc] px-3 py-1 text-[#d95f5b]">
                    Featured
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f4fb] px-3 py-1 text-[#7a7ea8]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#d95f5b]" aria-hidden />
                    {formatDateRange(event)}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#d95f5b]">
                    <Link href={event.url} className="transition hover:text-[#c64c48]">
                      {event.title}
                    </Link>
                  </h3>
                  {event.location ? (
                    <div className="flex items-center gap-2 text-sm text-[#7a7ea8]">
                      <MapPin className="h-4 w-4 text-[#d95f5b]" aria-hidden />
                      {event.location}
                    </div>
                  ) : null}
                  {event.description ? (
                    <p className="text-sm text-[#7a7ea8]">{event.description}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#6e72a0]">
                  {event.category ? (
                    <span className="rounded-full border border-[#d7dcf0] bg-[#f7f8ff] px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#7a7ea8]">
                      {event.category}
                    </span>
                  ) : null}
                  {event.registrationUrl ? (
                    <Link
                      href={event.registrationUrl}
                      className="inline-flex items-center gap-2 rounded-full bg-[#6f6ba8] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_10px_24px_rgba(111,107,168,0.25)] transition hover:-translate-y-0.5"
                    >
                      Save spot
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="relative h-full min-h-[160px] overflow-hidden rounded-2xl bg-[#f3f4fb]">
                {event.cover ? (
                  <Image
                    src={event.cover}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 220px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-[#A1A6C8]">
                    Add a cover image
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div
          id="subscribe"
          className="flex flex-col gap-3 rounded-2xl border border-[#edf0f7] bg-white px-6 py-5 text-sm text-[#7a7ea8] shadow-[0_18px_36px_rgba(77,86,125,0.08)] md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#6e72a0]">Share an ICS feed or mailing list.</p>
            <p>Make sure people never miss an event.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-[#e3e7f2] bg-white px-5 py-3 text-sm font-semibold text-[#6e72a0] shadow-[0_10px_24px_rgba(60,62,112,0.08)] transition hover:-translate-y-0.5"
            >
              View all events
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#f27f6c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(242,127,108,0.3)] transition hover:-translate-y-0.5"
            >
              Share calendar link
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
