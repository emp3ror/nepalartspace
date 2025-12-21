import Link from "next/link";

import { Card } from "@/components/card";
import { cn } from "@/lib/cn";
import { formatEventDateRange } from "@/lib/events";
import type { MdxEvent } from "@/lib/mdx-events";

type EventCardProps = {
  event: MdxEvent;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Card className={cn("flex h-full flex-col gap-4 bg-[#fffcf8]", className)}>
      <div className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#666]">
          {formatEventDateRange({
            date: event.date,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
          })}
        </span>

        <Link
          href={event.url}
          className="block text-lg font-semibold text-[#1a1a1a] transition hover:text-[#c08a2e]"
        >
          {event.title}
        </Link>
      </div>

      {event.description ? (
        <p className="text-sm text-[#666]">{event.description}</p>
      ) : null}

      {event.tags?.length ? (
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888]">
          {event.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff6e0] px-3 py-1 text-[#8a6d3b]">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/50">
        <span className="text-[#666]">{event.category ?? "Event"}</span>
        {event.location ? (
          <span className="truncate text-right text-[#888]">{event.location}</span>
        ) : (
          <span aria-hidden>→</span>
        )}
      </div>
    </Card>
  );
}
