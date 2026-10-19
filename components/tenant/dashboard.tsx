import Link from "next/link";
import {
  notices,
  payments,
  profile,
  stats,
  tenancy,
  tenant,
} from "./data";

const tone: Record<string, string> = {
  Current: "bg-sage text-forest",
  Paid: "bg-sage text-forest",
  Upcoming: "bg-line text-ink",
  Overdue: "bg-copper-soft text-[#8a3d16]",
  Arrears: "bg-copper-soft text-[#8a3d16]",
};

function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex w-fit px-2 py-1 text-xs ${tone[value] ?? "bg-line text-ink"}`}
    >
      {value}
    </span>
  );
}

function PageIntro({ title, intro }: { title: string; intro: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{intro}</p>
    </div>
  );
}

export function TenantDashboard() {
  const nextPayment =
    payments.find((item) => item.status === "Upcoming") ?? payments[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          {tenant.lga} · Plot {tenant.plot}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          Good afternoon, {tenant.firstName}.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          Your tenancy at {tenant.unit}, {tenant.property} is current. November
          rent is due on {nextPayment.due}.
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
              Your tenancy
            </h2>
            <Link
              href="/tenant/tenancy"
              className="text-sm text-forest hover:text-copper"
            >
              View details
            </Link>
          </div>
          <div className="border border-line bg-paper-raised">
            <div className="grid gap-3 border-b border-line px-4 py-4 md:grid-cols-[4rem_1fr_8rem] md:items-center">
              <p className="font-display text-xl">{tenant.plot}</p>
              <div>
                <p className="font-medium">
                  {tenancy.unit} · {tenancy.property}
                </p>
                <p className="text-sm text-ink-muted">
                  {tenancy.type} · landlord {tenancy.landlord}
                </p>
              </div>
              <Status value={tenancy.status} />
            </div>
            <dl className="grid gap-4 px-4 py-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-ink-muted">Starts</dt>
                <dd className="mt-1 text-sm">{tenancy.start}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Ends</dt>
                <dd className="mt-1 text-sm">{tenancy.end}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Paid to date</dt>
                <dd className="mt-1 text-sm">{tenancy.amountPaid}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border border-line bg-paper-raised p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            Next payment
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-tight">
            {nextPayment.period}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {nextPayment.amount} due {nextPayment.due}.
          </p>
          <div className="mt-4">
            <Status value={nextPayment.status} />
          </div>
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm font-medium">{notices[0].title}</p>
            <p className="mt-1 text-sm text-ink-muted">{notices[0].copy}</p>
            <Link
              href="/tenant/notices"
              className="mt-4 inline-flex text-sm text-forest hover:text-copper"
            >
              All notices
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function TenancyPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="My tenancy"
        intro="The unit you occupy and the terms held with your landlord on the Nsukka register."
      />
      <div className="mt-6 border border-line bg-paper-raised">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-4 py-5">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              Plot {tenant.plot}
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">
              {tenancy.unit}, {tenancy.property}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{tenancy.use}</p>
          </div>
          <Status value={tenancy.status} />
        </div>
        <dl className="grid gap-6 px-4 py-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-muted">Type of property</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.type}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Landlord</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.landlord}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Tenancy start</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.start}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Tenancy end</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.end}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Total amount paid</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.amountPaid}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Outstanding balance</dt>
            <dd className="mt-1 text-sm font-medium">{tenancy.balance}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function RentPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Rent & payments"
        intro="Payment windows for your tenancy. Paid months stay on this record with the housing desk."
      />
      <ul className="mt-6 border border-line bg-paper-raised">
        {payments.map((row) => (
          <li
            key={row.period}
            className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_8rem_7rem] md:items-center"
          >
            <div>
              <p className="font-medium">{row.period}</p>
              <p className="text-sm text-ink-muted">Due {row.due}</p>
            </div>
            <p className="text-sm">{row.amount}</p>
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
        intro="Messages from Nsukka Local Government and your landlord about the home you occupy."
      />
      <ul className="mt-6 border border-line bg-paper-raised">
        {notices.map((notice) => (
          <li
            key={notice.title}
            className="border-b border-line px-4 py-4 last:border-b-0"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
              {notice.date}
            </p>
            <h2 className="mt-2 font-display text-xl tracking-tight">
              {notice.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              {notice.copy}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfilePage() {
  const personal = [
    ["Full name", tenant.name],
    ["Email", tenant.email],
    ["Phone", tenant.phone],
    ["Gender", profile.gender],
    ["Date of birth", profile.dateOfBirth],
    ["Marital status", profile.maritalStatus],
    ["Occupation", profile.occupation],
    ["Employer / Business", profile.employer],
    ["Country of origin", profile.countryOfOrigin],
    ["State of origin", profile.stateOfOrigin],
    ["Local government", profile.localGovernment],
    ["Home town", profile.homeTown],
    ["Dependents", profile.dependents],
  ] as const;

  const kin = [
    ["Full name", profile.kinName],
    ["Relationship", profile.kinRelationship],
    ["Phone", profile.kinPhone],
    ["Address", profile.kinAddress],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Profile"
        intro="Personal details and emergency contact held against your tenancy record."
      />
      <div className="mt-6 grid gap-6">
        <section className="border border-line bg-paper-raised">
          <div className="border-b border-line px-4 py-4">
            <h2 className="font-display text-xl tracking-tight">
              Personal information
            </h2>
          </div>
          <dl className="grid gap-5 px-4 py-5 sm:grid-cols-2">
            {personal.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="border border-line bg-paper-raised">
          <div className="border-b border-line px-4 py-4">
            <h2 className="font-display text-xl tracking-tight">
              Next of kin / Emergency contact
            </h2>
          </div>
          <dl className="grid gap-5 px-4 py-5 sm:grid-cols-2">
            {kin.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
