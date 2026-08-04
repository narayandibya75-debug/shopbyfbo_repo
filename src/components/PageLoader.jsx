import React from "react";

/**
 * Shown briefly while a lazy-loaded route chunk downloads.
 * Kept intentionally minimal so it doesn't cause layout shift.
 */
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32" role="status" aria-live="polite">
      <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
