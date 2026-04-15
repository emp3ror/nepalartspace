"use client";

import { FormEvent, useState } from "react";

type EventRsvpFormProps = {
  eventSlug: string;
  eventTitle: string;
};

type Status = {
  type: "idle" | "success" | "error";
  message?: string;
};

export function EventRsvpForm({ eventSlug, eventTitle }: EventRsvpFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      eventSlug,
      eventTitle,
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      guests: Number(formData.get("guests") ?? 1),
      note: String(formData.get("note") ?? "").trim(),
    };

    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus({ type: "error", message: body?.error ?? "Could not submit RSVP." });
        return;
      }

      form.reset();
      setStatus({ type: "success", message: "RSVP received. We will follow up by email." });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#eadfcd] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-semibold text-[#1a1a1a]">RSVP for this event</h2>
      <p className="mt-2 text-sm text-[#666]">Reserve your spot and we will follow up by email.</p>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-sm text-[#1a1a1a]">
          Full name
          <input
            name="name"
            required
            className="rounded-xl border border-[#ddd2bf] px-3 py-2 outline-none focus:border-[#c08a2e]"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-1 text-sm text-[#1a1a1a]">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-[#ddd2bf] px-3 py-2 outline-none focus:border-[#c08a2e]"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1 text-sm text-[#1a1a1a]">
          Number of guests
          <input
            type="number"
            name="guests"
            min={1}
            max={20}
            defaultValue={1}
            required
            className="rounded-xl border border-[#ddd2bf] px-3 py-2 outline-none focus:border-[#c08a2e]"
          />
        </label>
        <label className="grid gap-1 text-sm text-[#1a1a1a]">
          Note (optional)
          <textarea
            name="note"
            rows={3}
            className="rounded-xl border border-[#ddd2bf] px-3 py-2 outline-none focus:border-[#c08a2e]"
            placeholder="Accessibility needs, questions, etc."
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-fit items-center rounded-full bg-[#fcd68a] px-5 py-2 text-sm font-semibold text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </button>
      </form>

      {status.type !== "idle" ? (
        <p className={`mt-3 text-sm ${status.type === "success" ? "text-green-700" : "text-red-600"}`}>{status.message}</p>
      ) : null}
    </section>
  );
}
