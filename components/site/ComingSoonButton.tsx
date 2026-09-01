"use client";

import { useState, type CSSProperties } from "react";

export default function ComingSoonButton({
  className = "btn btn--primary",
  style,
  children,
  message = "Ticket sales open soon — check back shortly!",
}: {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="cs-wrap">
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open && (
        <span className="cs-note" role="status">
          {message}
        </span>
      )}
    </span>
  );
}
