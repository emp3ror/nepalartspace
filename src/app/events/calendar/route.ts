import { NextRequest, NextResponse } from "next/server";

import { buildIcsFeed } from "@/lib/calendar";
import { getAllEvents } from "@/lib/mdx-events";

const CALENDAR_NAME = "Nepal Art Space Events";

const getOrigin = (request: NextRequest) => {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");

  if (forwardedProto && (forwardedHost ?? host)) {
    return `${forwardedProto}://${forwardedHost ?? host}`;
  }

  return request.nextUrl.origin;
};

export async function GET(request: NextRequest) {
  const events = await getAllEvents();
  const origin = getOrigin(request);

  const ics = buildIcsFeed(
    events.map((event) => ({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      url: event.url.startsWith("http") ? event.url : `${origin}${event.url}`,
    })),
    { name: CALENDAR_NAME },
  );

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="events.ics"',
    },
  });
}
