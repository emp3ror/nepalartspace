import { NextResponse } from "next/server";
import { z } from "zod";

const statusEnum = z.enum(["Scheduled", "Draft", "Cancelled", "Completed"]);
const optionalUrlField = (message: string) => z.string().trim().url(message).optional().or(z.literal(""));

const eventSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().min(1, "Email is required.").email("Provide a valid email address."),
  title: z.string().trim().min(1, "Event title is required.").max(300),
  description: z.string().trim().max(500).optional(),
  date: z.string().trim().min(1, "Event date is required."),
  endDate: z.string().trim().optional(),
  startTime: z.string().trim().optional(),
  endTime: z.string().trim().optional(),
  location: z.string().trim().max(300).optional(),
  organizer: z.string().trim().max(200).optional(),
  status: statusEnum.optional(),
  tags: z.string().trim().max(500).optional(),
  rsvp: z.boolean().optional(),
  rsvpUrl: optionalUrlField("RSVP URL must be a valid URL."),
  imageUrl: optionalUrlField("Image URL must be a valid URL."),
  instagramUrl: optionalUrlField("Instagram URL must be a valid URL."),
  tiktokUrl: optionalUrlField("TikTok URL must be a valid URL."),
  facebookUrl: optionalUrlField("Facebook URL must be a valid URL."),
  linkedinUrl: optionalUrlField("LinkedIn URL must be a valid URL."),
  details: z.string().trim().min(1, "Details are required.").max(5000),
})
  .superRefine((data, ctx) => {
    const startDate = new Date(`${data.date}T00:00:00`);
    if (Number.isNaN(startDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date must be a valid YYYY-MM-DD value.",
        path: ["date"],
      });
    }

    if (data.endDate) {
      const endDate = new Date(`${data.endDate}T00:00:00`);
      if (Number.isNaN(endDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be a valid YYYY-MM-DD value.",
          path: ["endDate"],
        });
      } else if (!Number.isNaN(startDate.getTime()) && endDate < startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be earlier than date.",
          path: ["endDate"],
        });
      }
    }

    if (data.rsvpUrl && !data.rsvp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enable RSVP when RSVP URL is provided.",
        path: ["rsvp"],
      });
    }
  });

const escapeInline = (value: string) => value.replace(/`/g, "\\`");

const parseTags = (tags?: string) =>
  (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

function formatMarkdownMessage(payload: z.infer<typeof eventSubmissionSchema>) {
  const escapedDetails = payload.details.replace(/```/g, "\\`\\`\\`");
  const tags = parseTags(payload.tags);
  const lines = [
    `title: "${escapeInline(payload.title)}"`,
    payload.description ? `description: "${escapeInline(payload.description)}"` : null,
    `date: ${payload.date}`,
    payload.endDate ? `endDate: ${payload.endDate}` : null,
    payload.startTime ? `startTime: "${escapeInline(payload.startTime)}"` : null,
    payload.endTime ? `endTime: "${escapeInline(payload.endTime)}"` : null,
    payload.location ? `location: "${escapeInline(payload.location)}"` : null,
    payload.organizer ? `organizer: "${escapeInline(payload.organizer)}"` : null,
    payload.status ? `status: "${payload.status}"` : null,
    tags.length ? `tags: [${tags.map((tag) => `"${escapeInline(tag)}"`).join(", ")}]` : null,
    payload.imageUrl ? `cover: "${escapeInline(payload.imageUrl)}"` : null,
    payload.rsvp ? `rsvp: true` : `rsvp: false`,
    payload.rsvp && payload.rsvpUrl ? `rsvpUrl: "${escapeInline(payload.rsvpUrl)}"` : null,
  ].filter(Boolean);
  const socialLines = [
    payload.instagramUrl ? `- Instagram: ${payload.instagramUrl}` : null,
    payload.tiktokUrl ? `- TikTok: ${payload.tiktokUrl}` : null,
    payload.facebookUrl ? `- Facebook: ${payload.facebookUrl}` : null,
    payload.linkedinUrl ? `- LinkedIn: ${payload.linkedinUrl}` : null,
  ].filter(Boolean);

  return [
    "# New Event Submission",
    "",
    `**Submitted by:** ${payload.name} (${payload.email})`,
    "",
    "## Suggested `content/events/*.mdx` frontmatter",
    "",
    "```yaml",
    "---",
    ...lines,
    "---",
    "```",
    ...(socialLines.length
      ? [
          "",
          "## Social Links",
          "",
          ...socialLines,
        ]
      : []),
    "",
    "## Event Body",
    "",
    "```md",
    escapedDetails,
    "```",
  ].join("\n");
}

export async function POST(request: Request) {
  const json = (await request.json().catch(() => null)) as unknown;
  const parsed = eventSubmissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid event submission.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.EVENT_SUBMISSION_DISCORD_WEBHOOK_URL ?? process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      {
        error: "Missing EVENT_SUBMISSION_DISCORD_WEBHOOK_URL (or DISCORD_WEBHOOK_URL).",
      },
      { status: 500 },
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: formatMarkdownMessage(parsed.data),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json(
      {
        error: "Discord webhook request failed.",
        details: errorBody,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent: true });
}
