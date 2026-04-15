"use client";

import { FormEvent, useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message?: string;
};

export function EventSubmissionForm() {
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [hasRsvp, setHasRsvp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim(),
      endDate: isMultiDay ? String(formData.get("endDate") ?? "").trim() : "",
      startTime: String(formData.get("startTime") ?? "").trim(),
      endTime: String(formData.get("endTime") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      organizer: String(formData.get("organizer") ?? "").trim(),
      status: String(formData.get("status") ?? "").trim(),
      tags: String(formData.get("tags") ?? "").trim(),
      rsvp: hasRsvp,
      rsvpUrl: hasRsvp ? String(formData.get("rsvpUrl") ?? "").trim() : "",
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
      tiktokUrl: String(formData.get("tiktokUrl") ?? "").trim(),
      facebookUrl: String(formData.get("facebookUrl") ?? "").trim(),
      linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim(),
      details: String(formData.get("details") ?? "").trim(),
    };

    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/events/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus({ type: "error", message: body?.error ?? "Could not send event submission." });
        return;
      }

      form.reset();
      setIsMultiDay(false);
      setHasRsvp(false);
      setStatus({ type: "success", message: "Submitted. Thank you for sharing your event." });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="event-submission-form" className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Your name
        <input
          name="name"
          required
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>
      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a] md:col-span-2">
        Title
        <input
          name="title"
          required
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="Zine Sharing Camp"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a] md:col-span-2">
        Description
        <input
          name="description"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="One-line summary for event cards."
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Date
        <input
          type="date"
          name="date"
          required
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isMultiDay}
            onChange={(currentEvent) => setIsMultiDay(currentEvent.target.checked)}
            className="h-4 w-4 rounded border-[#cdbd9c] text-[#c08a2e] focus:ring-[#f1dfbc]"
          />
          Multi-day event
        </span>
        {isMultiDay ? (
          <input
            type="date"
            name="endDate"
            required
            className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          />
        ) : (
          <span className="text-xs text-[#777]">Enable to add `endDate`.</span>
        )}
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Start time
        <input
          type="time"
          name="startTime"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        End time
        <input
          type="time"
          name="endTime"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Location
        <input
          name="location"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="Nepal Art Space Studio, Patan"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Organizer
        <input
          name="organizer"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="Nepal Art Space"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Status
        <select
          name="status"
          defaultValue="Scheduled"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Draft">Draft</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Tags
        <input
          name="tags"
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="Zine, Print, Workshop, Community"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a] md:col-span-2">
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasRsvp}
            onChange={(currentEvent) => setHasRsvp(currentEvent.target.checked)}
            className="h-4 w-4 rounded border-[#cdbd9c] text-[#c08a2e] focus:ring-[#f1dfbc]"
          />
          Enable RSVP
        </span>
        {hasRsvp ? (
          <input
            type="url"
            name="rsvpUrl"
            placeholder="https://example.com/rsvp"
            className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          />
        ) : (
          <span className="text-xs text-[#777]">RSVP URL is optional. If skipped, modal RSVP can be used.</span>
        )}
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a] md:col-span-2">
        Image URL
        <input
          type="url"
          name="imageUrl"
          placeholder="https://images.unsplash.com/..."
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Instagram URL
        <input
          type="url"
          name="instagramUrl"
          placeholder="https://instagram.com/..."
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        TikTok URL
        <input
          type="url"
          name="tiktokUrl"
          placeholder="https://tiktok.com/@..."
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        Facebook URL
        <input
          type="url"
          name="facebookUrl"
          placeholder="https://facebook.com/..."
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a]">
        LinkedIn URL
        <input
          type="url"
          name="linkedinUrl"
          placeholder="https://linkedin.com/in/..."
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
        />
      </label>

      <label className="grid gap-1 text-sm text-[#1a1a1a] md:col-span-2">
        Event details (markdown)
        <textarea
          name="details"
          rows={7}
          required
          className="rounded-xl border border-[#ddd2bf] bg-white px-3 py-2 outline-none transition focus:border-[#c08a2e] focus:ring-2 focus:ring-[#f1dfbc]"
          placeholder="Write the event body content that should go below frontmatter in the MDX file."
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-fit items-center rounded-full bg-[#fcd68a] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:-translate-y-0.5 hover:bg-[#f9cb73] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending..." : "Send Submission"}
        </button>

        {status.type !== "idle" ? (
          <p className={`mt-3 text-sm ${status.type === "success" ? "text-green-700" : "text-red-600"}`}>{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}
