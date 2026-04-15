"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

import { cn } from "@/lib/cn";

type PopupModalProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  title?: string;
  description?: string;
  panelClassName?: string;
  children: ReactNode;
};

export function PopupModal({
  open,
  onClose,
  ariaLabel,
  title,
  description,
  panelClassName,
  children,
}: PopupModalProps) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-[#e6d5bb] bg-[#fffdf8] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] md:p-7",
          panelClassName,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ece3] text-[#1a1a1a] transition hover:bg-[#e6ddcf]"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {title ? <h2 className="pr-12 text-2xl font-semibold tracking-tight text-[#1a1a1a]">{title}</h2> : null}
        {description ? <p className="mt-2 pr-12 text-sm text-[#666]">{description}</p> : null}

        <div className={title || description ? "mt-5" : ""}>{children}</div>
      </div>
    </div>
  );
}
