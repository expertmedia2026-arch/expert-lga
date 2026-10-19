import Image from "next/image";
import Link from "next/link";
import { PropertyOwnerLoginForm } from "@/components/login/property-owner-form";

export const metadata = {
  title: "Property Owner Login — Expert LGA",
  description:
    "Sign in to view and update properties registered with the local government.",
};

const records = [
  { n: "01", label: "View registered properties" },
  { n: "02", label: "Update ownership records" },
  { n: "03", label: "Track occupancy and tenancy" },
];

export default function PropertyOwnerLoginPage() {
  return (
    <main className="grid min-h-full flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="relative hidden overflow-hidden bg-forest-deep text-paper lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/hero/hero-new-homes.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-forest-deep/40" />
        <div className="relative px-10 pt-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center border border-paper/30 bg-copper text-white">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 19V9.8L12 4l8 5.8V19h-6.2v-6.4H10.2V19H4Z"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-lg leading-none">
                Expert LGA
              </span>
              <span className="mt-1 block font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
                Property register
              </span>
            </span>
          </Link>
        </div>
        <div className="relative px-10 pb-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-copper-soft uppercase">
            For owners
          </p>
          <h2 className="mt-3 max-w-md font-display text-4xl leading-tight tracking-tight">
            Your properties, kept on the public register.
          </h2>
          <ul className="mt-8 max-w-sm divide-y divide-white/15 border-y border-white/15">
            {records.map((record) => (
              <li key={record.n} className="flex items-baseline gap-4 py-3">
                <span className="font-mono text-xs text-copper-soft">
                  {record.n}
                </span>
                <span className="text-sm text-sage">{record.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink lg:hidden"
        >
          <span aria-hidden="true">←</span> Back to portal
        </Link>
        <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
          Expert LGA
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Property Owner Login
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
          Sign in to see the plots, titles, and occupancy records held in your
          name.
        </p>
        <div className="max-w-md">
          <PropertyOwnerLoginForm />
        </div>
        <Link
          href="/"
          className="mt-10 hidden text-sm text-ink-muted hover:text-ink lg:inline-flex"
        >
          ← Back to portal
        </Link>
      </section>
    </main>
  );
}
