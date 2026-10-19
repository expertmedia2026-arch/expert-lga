"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { owner } from "./data";

const nav = [
  { href: "/property-owner", label: "Overview" },
  { href: "/property-owner/properties", label: "Properties" },
  { href: "/property-owner/tenancies", label: "Tenancies" },
  { href: "/property-owner/records", label: "Ownership records" },
  { href: "/property-owner/notices", label: "Notices" },
] as const;

function isCurrent(href: string, pathname: string) {
  return pathname === href;
}

function Brand() {
  return (
    <Link href="/property-owner" className="flex items-center gap-3">
      <span className="grid size-9 place-items-center border border-paper/20 bg-copper text-white">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 19V9.8L12 4l8 5.8V19h-6.2v-6.4H10.2V19H4Z"
          />
        </svg>
      </span>
      <span>
        <span className="block font-display text-lg leading-none text-paper">
          Expert LGA
        </span>
        <span className="mt-1 block font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
          Owner desk
        </span>
      </span>
    </Link>
  );
}

export function OwnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = nav.find((item) => isCurrent(item.href, pathname));

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex h-dvh min-h-0 flex-1 overflow-hidden bg-paper text-ink">
      <aside className="hidden w-64 shrink-0 flex-col bg-forest-deep text-sage lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <Brand />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = isCurrent(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-paper"
                    : "hover:bg-white/5 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-5">
          <p className="text-sm text-paper">{owner.name}</p>
          <p className="mt-1 text-xs text-sage">{owner.lga}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-copper-soft uppercase">
            {owner.code}
          </p>
          <Link
            href="/login/property-owner"
            className="mt-4 inline-flex text-xs tracking-wide text-copper-soft uppercase hover:text-paper"
          >
            Sign out
          </Link>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-forest-deep text-sage transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        inert={!menuOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid size-10 place-items-center border border-white/20 text-paper"
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
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = isCurrent(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 text-sm ${
                  active ? "bg-white/10 text-paper" : "text-sage"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-5">
          <p className="text-sm text-paper">{owner.name}</p>
          <p className="mt-1 text-xs text-sage">{owner.code}</p>
          <Link
            href="/login/property-owner"
            className="mt-3 inline-flex text-xs tracking-wide text-copper-soft uppercase"
          >
            Sign out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-paper-raised px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-10 place-items-center border border-line lg:hidden"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                {current?.label ?? "Overview"}
              </p>
              <p className="text-sm text-ink-muted">{owner.date}</p>
            </div>
          </div>
          <p className="hidden text-sm text-ink sm:block">{owner.name}</p>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
