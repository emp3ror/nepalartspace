"use client";

import { useState } from "react";

import { EventRsvpForm } from "@/components/events/event-rsvp-form";
import { PopupModal } from "@/components/ui/popup-modal";

type EventRsvpModalTriggerProps = {
  eventSlug: string;
  eventTitle: string;
};

export function EventRsvpModalTrigger({ eventSlug, eventTitle }: EventRsvpModalTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full bg-[#fcd68a] px-5 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:-translate-y-0.5"
      >
        RSVP
      </button>

      <PopupModal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel={`RSVP for ${eventTitle}`}
        title={`RSVP for ${eventTitle}`}
        panelClassName="max-w-xl"
      >
        <EventRsvpForm eventSlug={eventSlug} eventTitle={eventTitle} />
      </PopupModal>
    </>
  );
}
