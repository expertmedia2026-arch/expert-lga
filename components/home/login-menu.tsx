"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const items = [
  { href: "/login/property-owner", label: "Property Owner Login" },
  { href: "/login/tenant", label: "Tenant login" },
  { href: "/login/admin", label: "Admin Login" },
];

export function LoginMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = document.getElementById(panelId);
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>("button, a")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, panelId]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="inline-flex h-12 min-w-[11.5rem] items-center justify-center border border-white/80 px-6 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink"
      >
        Log in
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden={!open}
        aria-label="Close log in menu"
        onClick={close}
        className={`fixed inset-0 z-30 bg-black/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id={panelId}
        role="dialog"
        aria-modal={open}
        aria-label="Log in"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-40 flex w-[min(24rem,82vw)] flex-col bg-paper text-ink shadow-[0_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="font-display text-2xl tracking-tight">Log in</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="grid size-10 place-items-center border border-line text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <span className="sr-only">Close</span>
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border-b border-line px-2 py-5 text-lg transition-colors hover:text-copper"
            >
              {item.label}
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
