"use client";

import { useState } from "react";

import { EventSubmissionForm } from "@/components/events/event-submission-form";
import { PopupModal } from "@/components/ui/popup-modal";

export function EventSubmissionModalTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full bg-[#fcd68a] px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:-translate-y-0.5 hover:bg-[#f9cb73]"
      >
        Submit Your Event
      </button>

      <PopupModal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Submit your event"
        title="Submit Your Event"
        description="Share the details below and we'll publish it on Nepal Art Space."
        panelClassName="max-w-4xl"
      >
        <EventSubmissionForm />
      </PopupModal>
    </>
  );
}
