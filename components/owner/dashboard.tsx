import Link from "next/link";
import { notices, owner, properties, records, stats } from "./data";

const tone: Record<string, string> = {
  Occupied: "bg-sage text-forest",
  Registered: "bg-sage text-forest",
  Accepted: "bg-sage text-forest",
  Current: "bg-sage text-forest",
  "Owner occupied": "bg-forest text-paper",
  Vacant: "bg-line text-ink",
  "Documents due": "bg-line text-ink",
  "Under review": "bg-copper-soft text-[#8a3d16]",
  "Update pending": "bg-copper-soft text-[#8a3d16]",
  Arrears: "bg-copper-soft text-[#8a3d16]",
};

function Status({ value }: { value: string }) {
  return (
    <span className={`inline-flex w-fit px-2 py-1 text-xs ${tone[value] ?? "bg-line text-ink"}`}>
      {value}
    </span>
  );
}

function PageIntro({
  title,
  intro,
}: {
  title: string;
  intro: string;
}) {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{intro}</p>
    </div>
  );
}

export function OwnerDashboard() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          {owner.lga} · {owner.code}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          Good afternoon, Musa.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          Four properties are on the Nsukka register in your name. Plot 12 is
          still waiting on a change of use.
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
              Your properties
            </h2>
            <Link
              href="/property-owner/properties"
              className="text-sm text-forest hover:text-copper"
            >
              Open register
            </Link>
          </div>
          <PropertyList rows={properties} />
        </section>
        <section className="border border-line bg-paper-raised p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            From the desk
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-tight">
            {notices[0].title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{notices[0].copy}</p>
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm font-medium">{records[0].request}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Plot {records[0].plot} · filed {records[0].filed}
            </p>
            <div className="mt-3">
              <Status value={records[0].status} />
            </div>
            <Link
              href="/property-owner/records"
              className="mt-4 inline-flex text-sm text-forest hover:text-copper"
            >
              Ownership records
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function PropertyList({ rows }: { rows: typeof properties }) {
  return (
    <ul className="border border-line bg-paper-raised">
      {rows.map((plot) => (
        <li
          key={plot.plot}
          className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_9rem_8rem] md:items-center"
        >
          <p className="font-display text-xl">{plot.plot}</p>
          <div>
            <p className="font-medium">{plot.address}</p>
            <p className="text-sm text-ink-muted">
              {plot.use} · {plot.occupant}
            </p>
          </div>
          <Status value={plot.title} />
          <Status value={plot.status} />
        </li>
      ))}
    </ul>
  );
}

export function RecordsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Ownership records"
        intro="Changes you have sent to the Nsukka housing desk."
      />
      <ul className="mt-6 border border-line bg-paper-raised">
        {records.map((row) => (
          <li
            key={row.request}
            className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_8rem_9rem] md:items-center"
          >
            <p className="font-display text-xl">{row.plot}</p>
            <div>
              <p className="font-medium">{row.request}</p>
              <p className="text-sm text-ink-muted">Filed {row.filed}</p>
            </div>
            <p className="text-sm text-ink-muted">{owner.code}</p>
            <Status value={row.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NoticesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Notices"
        intro="Messages from Nsukka Local Government about properties in your name."
      />
      <ul className="mt-6 border border-line bg-paper-raised">
        {notices.map((notice) => (
          <li key={notice.title} className="border-b border-line px-4 py-4 last:border-b-0">
            <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
              {notice.date}
            </p>
            <h2 className="mt-2 font-display text-xl tracking-tight">{notice.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              {notice.copy}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
