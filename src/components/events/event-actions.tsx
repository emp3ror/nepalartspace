"use client";

import { CalendarDays, CalendarPlus, Download } from "lucide-react";
import { useMemo } from "react";

import { ContentActions } from "@/components/actions/content-actions";
import { EventRsvpModalTrigger } from "@/components/events/event-rsvp-modal-trigger";
import { buildGoogleCalendarLink, buildIcsDataUri, buildMicrosoftCalendarLink } from "@/lib/calendar";

type EventActionsProps = {
  event: {
    slug: string;
    title: string;
    description?: string;
    date: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    url: string;
    rsvp?: boolean;
    rsvpUrl?: string;
  };
};

const BOOKMARK_KEY = "starter-bookmarked-events";
const LIKE_KEY = "starter-liked-events";

export function EventActions({ event }: EventActionsProps) {
  const eventUrl = event.url;

  const calendarData = useMemo(
    () => ({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      url: eventUrl,
    }),
    [event.date, event.description, event.endDate, event.endTime, event.location, event.startTime, event.title, eventUrl],
  );

  const googleLink = useMemo(() => buildGoogleCalendarLink(calendarData), [calendarData]);
  const microsoftLink = useMemo(() => buildMicrosoftCalendarLink(calendarData), [calendarData]);
  const icsHref = useMemo(() => buildIcsDataUri(calendarData), [calendarData]);

  return (
    <ContentActions
      itemId={event.slug}
      title={event.title}
      description={event.description}
      url={eventUrl}
      likeStorageKey={LIKE_KEY}
      bookmark={{ storageKey: BOOKMARK_KEY, slug: event.slug }}
      header={
        event.rsvp ? (
          <div className="mb-1">
            {event.rsvpUrl ? (
              <a
                href={event.rsvpUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-[#fcd68a] px-5 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:-translate-y-0.5"
              >
                RSVP
              </a>
            ) : (
              <EventRsvpModalTrigger eventSlug={event.slug} eventTitle={event.title} />
            )}
          </div>
        ) : undefined
      }
      calendar={{
        options: [
          {
            id: "google",
            label: "Google Calendar",
            href: googleLink,
            icon: CalendarPlus,
            target: "_blank",
            rel: "noreferrer",
          },
          {
            id: "microsoft",
            label: "Microsoft Outlook",
            href: microsoftLink,
            icon: CalendarDays,
            target: "_blank",
            rel: "noreferrer",
          },
          {
            id: "ics",
            label: "Download .ics",
            href: icsHref,
            icon: Download,
            downloadFilename: `${event.slug}.ics`,
          },
        ],
      }}
    />
  );
}
