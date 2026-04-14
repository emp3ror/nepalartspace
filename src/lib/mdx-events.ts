import fs from "fs/promises";
import path from "path";

import matter from "gray-matter";

export type MdxEvent = {
  _id: string;
  slug: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  tags?: string[];
  cover?: string;
  registrationUrl?: string;
  category?: string;
  rsvp?: boolean;
  rsvpUrl?: string;
  body: string;
};

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

const toArray = (value: unknown): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

const normalizeDateValue = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // Normalize YAML-parsed Date objects to YYYY-MM-DD.
    return value.toISOString().split("T")[0];
  }
  return String(value).trim();
};

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return undefined;
};

const normalizeRsvp = (value: unknown): { enabled?: boolean; url?: string } => {
  if (typeof value === "string") {
    const normalized = value.trim();
    const lower = normalized.toLowerCase();
    if (lower === "true") return { enabled: true };
    if (lower === "false") return { enabled: false };
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return { enabled: true, url: normalized };
    }
  }

  if (typeof value === "boolean") {
    return { enabled: value };
  }

  return {};
};

const normalizeEvent = ({
  slug,
  data,
  content,
}: {
  slug: string;
  data: matter.GrayMatterFile<string>["data"];
  content: string;
}): MdxEvent | null => {
  if (!data.title || !data.date) {
    return null;
  }

  const rsvp = normalizeRsvp(data.rsvp);

  return {
    _id: slug,
    slug,
    url: `/events/${slug}`,
    title: String(data.title),
    description: data.description ? String(data.description) : undefined,
    date: normalizeDateValue(data.date) as string,
    endDate: normalizeDateValue(data.endDate),
    startTime: data.startTime ? String(data.startTime) : undefined,
    endTime: data.endTime ? String(data.endTime) : undefined,
    location: data.location ? String(data.location) : undefined,
    tags: toArray(data.tags),
    cover: data.cover ? String(data.cover) : undefined,
    registrationUrl: data.registrationUrl ? String(data.registrationUrl) : undefined,
    category: data.category ? String(data.category) : undefined,
    rsvp: rsvp.enabled ?? normalizeBoolean(data.rsvp),
    rsvpUrl: rsvp.url,
    body: content,
  };
};

export const getEventSlugs = async () => {
  const entries = await fs.readdir(EVENTS_DIR);
  return entries
    .filter((entry) => entry.endsWith(".mdx") && entry !== "index.mdx")
    .map((entry) => entry.replace(/\.mdx$/, ""));
};

export const getEventBySlug = async (slug: string): Promise<MdxEvent | null> => {
  try {
    const filePath = path.join(EVENTS_DIR, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    return normalizeEvent({ slug, data, content });
  } catch {
    return null;
  }
};

export const getAllEvents = async (): Promise<MdxEvent[]> => {
  const slugs = await getEventSlugs();
  const events = await Promise.all(slugs.map((slug) => getEventBySlug(slug)));
  return events
    .filter((event): event is MdxEvent => Boolean(event))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export type EventsOverview = {
  title: string;
  intro?: string;
  description?: string;
  updated?: string;
  body: string;
};

export const getEventsOverview = async (): Promise<EventsOverview | null> => {
  try {
    const overviewPath = path.join(EVENTS_DIR, "index.mdx");
    const raw = await fs.readFile(overviewPath, "utf8");
    const { data, content } = matter(raw);

    return {
      title: data.title ? String(data.title) : "Events and milestones",
      intro: data.intro ? String(data.intro) : undefined,
      description: data.description ? String(data.description) : undefined,
      updated: data.updated ? String(data.updated) : undefined,
      body: content,
    };
  } catch {
    return null;
  }
};
