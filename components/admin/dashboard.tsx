"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  applications,
  inspections,
  notices,
  properties,
  sittings,
  stats,
  tenancies,
  type ApplicationStatus,
} from "./data";

const statusTone: Record<ApplicationStatus, string> = {
  "Under review": "bg-copper-soft text-[#8a3d16]",
  "Documents due": "bg-line text-ink",
  "Ready for board": "bg-forest text-paper",
  Allocated: "bg-sage text-forest",
};

function Status({ value }: { value: string }) {
  const tone =
    value in statusTone
      ? statusTone[value as ApplicationStatus]
      : value === "Arrears" || value === "Under review"
        ? "bg-copper-soft text-[#8a3d16]"
        : value === "Vacant" || value === "Scheduled" || value === "Invited"
          ? "bg-line text-ink"
          : "bg-sage text-forest";

  return (
    <span className={`inline-flex px-2 py-1 text-xs ${tone}`}>{value}</span>
  );
}

export function AdminDashboard() {
  return <Overview />;
}

function Overview() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Good afternoon, Amina.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          One file is ready for the 21 October board. Ward 3 still has an
          application under review.
        </p>
      </div>

      <dl className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper-raised px-5 py-5">
            <dt className="text-xs text-ink-muted">{stat.label}</dt>
            <dd className="mt-2 font-display text-3xl tracking-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">
              Awaiting action
            </h2>
            <Link
              href="/super-admin/applications"
              className="text-sm text-forest hover:text-copper"
            >
              Open queue
            </Link>
          </div>
          <ApplicationList rows={applications.slice(0, 4)} />
        </section>
        <section className="border border-line bg-paper-raised p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            Next sitting
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-tight">
            {sittings[0].date}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {sittings[0].title}. {sittings[0].cases}. {sittings[0].note}
          </p>
          <ul className="mt-6 space-y-4 border-t border-line pt-4">
            {inspections.slice(0, 3).map((visit) => (
              <li key={visit.plot} className="text-sm">
                <p className="font-medium">{visit.plot}</p>
                <p className="mt-1 text-ink-muted">
                  {visit.result} · {visit.date}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function ApplicationsPage() {
  const [query, setQuery] = useState("");
  const rows = applications.filter((item) => {
    const haystack = `${item.ref} ${item.name} ${item.ward} ${item.type}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <Applications query={query} onQuery={setQuery} rows={rows} />
  );
}

function Applications({
  query,
  onQuery,
  rows,
}: {
  query: string;
  onQuery: (value: string) => void;
  rows: typeof applications;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl tracking-tight">Applications</h1>
      <label className="mt-5 block max-w-md">
        <span className="sr-only">Search applications</span>
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search name, reference, or ward"
          className="h-12 w-full border border-line bg-paper-raised px-3 text-sm outline-none placeholder:text-ink-muted focus:border-forest"
        />
      </label>
      <div className="mt-6">
        {rows.length === 0 ? (
          <p className="border border-line bg-paper-raised px-4 py-6 text-sm text-ink-muted">
            No application matches that search.
          </p>
        ) : (
          <ApplicationList rows={rows} />
        )}
      </div>
    </div>
  );
}

function ApplicationList({ rows }: { rows: typeof applications }) {
  return (
    <div className="border border-line bg-paper-raised">
      <div className="hidden grid-cols-[9rem_1fr_6rem_8rem] gap-3 border-b border-line px-4 py-3 text-xs tracking-wide text-ink-muted uppercase md:grid">
        <span>Reference</span>
        <span>Applicant</span>
        <span>Ward</span>
        <span>Status</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.ref}
            className="grid gap-2 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[9rem_1fr_6rem_8rem] md:items-center md:gap-3"
          >
            <p className="font-mono text-xs text-ink-muted">{row.ref}</p>
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-ink-muted">{row.type}</p>
            </div>
            <p className="text-sm">{row.ward}</p>
            <Status value={row.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RegisterPage() {
  return (
    <Section title="Property register" intro="Plots, occupancy, and the last inspection on each record.">
      <ul className="border border-line bg-paper-raised">
        {properties.map((plot) => (
          <li
            key={plot.plot}
            className="grid gap-2 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_8rem_8rem] md:items-center"
          >
            <p className="font-display text-xl">{plot.plot}</p>
            <div>
              <p className="font-medium">{plot.use}</p>
              <p className="text-sm text-ink-muted">
                {plot.ward} · {plot.holder}
              </p>
            </div>
            <p className="text-sm text-ink-muted">{plot.inspected}</p>
            <Status value={plot.status} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TenanciesPage() {
  return (
    <Section title="Tenancies" intro="Council rents and arrears currently on the ledger.">
      <ul className="border border-line bg-paper-raised">
        {tenancies.map((row) => (
          <li
            key={row.tenant}
            className="grid gap-2 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_8rem_6rem] md:items-center"
          >
            <div>
              <p className="font-medium">{row.tenant}</p>
              <p className="text-sm text-ink-muted">{row.plot}</p>
            </div>
            <Status value={row.rent} />
            <p className="font-mono text-sm">{row.balance}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function BoardPage() {
  return (
    <Section title="Allocation board" intro="Sittings scheduled from the current waiting list.">
      <ul className="divide-y divide-line border-y border-line">
        {sittings.map((sitting) => (
          <li key={sitting.date} className="grid gap-2 py-5 md:grid-cols-[9rem_1fr_6rem]">
            <p className="font-mono text-xs text-ink-muted">{sitting.date}</p>
            <div>
              <h2 className="font-display text-xl">{sitting.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{sitting.note}</p>
            </div>
            <p className="text-sm">{sitting.cases}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function InspectionsPage() {
  return (
    <Section title="Inspections" intro="Field visits tied back to the plot record.">
      <ul className="border border-line bg-paper-raised">
        {inspections.map((visit) => (
          <li
            key={`${visit.plot}-${visit.date}`}
            className="grid gap-2 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_10rem_8rem] md:items-center"
          >
            <div>
              <p className="font-medium">{visit.plot}</p>
              <p className="text-sm text-ink-muted">{visit.officer}</p>
            </div>
            <p className="text-sm text-ink-muted">{visit.date}</p>
            <Status value={visit.result} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function NoticesPage() {
  return (
    <Section title="Notices" intro="What the council has posted for residents.">
      <ul className="divide-y divide-line border-y border-line">
        {notices.map((notice) => (
          <li key={notice.title} className="grid gap-2 py-5 md:grid-cols-[8rem_1fr]">
            <p className="font-mono text-xs text-ink-muted">{notice.date}</p>
            <div>
              <h2 className="font-display text-xl">{notice.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                {notice.copy}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl tracking-tight">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{intro}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
