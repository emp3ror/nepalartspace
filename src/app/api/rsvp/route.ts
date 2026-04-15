import { NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  eventSlug: z.string().trim().min(1, "Event slug is required.").max(200),
  eventTitle: z.string().trim().min(1, "Event title is required.").max(300),
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().min(1, "Email is required.").email("Provide a valid email address."),
  guests: z.number().int().min(1).max(20).default(1),
  note: z.string().trim().max(2000).optional(),
});

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const key = serviceRoleKey ?? anonKey;

  return {
    supabaseUrl,
    key,
  };
}

export async function POST(request: Request) {
  const json = (await request.json().catch(() => null)) as unknown;
  const parsed = rsvpSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid RSVP submission.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { supabaseUrl, key } = getSupabaseConfig();

  if (!supabaseUrl || !key) {
    return NextResponse.json(
      {
        error: "Supabase is not configured.",
        issues: {
          SUPABASE_URL: !supabaseUrl ? ["SUPABASE_URL is missing."] : [],
          SUPABASE_KEY: !key ? ["Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY."] : [],
        },
      },
      { status: 500 },
    );
  }

  const payload = parsed.data;

  const response = await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify([
      {
        event_slug: payload.eventSlug,
        event_title: payload.eventTitle,
        name: payload.name,
        email: payload.email,
        guests: payload.guests,
        note: payload.note ?? null,
      },
    ]),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json(
      {
        error: "Failed to save RSVP to Supabase.",
        details: errorBody,
      },
      { status: 502 },
    );
  }

  const created = (await response.json().catch(() => null)) as unknown;
  return NextResponse.json({ saved: true, rsvp: created });
}
