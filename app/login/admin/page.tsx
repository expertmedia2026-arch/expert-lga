import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/login/admin-form";

export const metadata = {
  title: "Admin Login — Expert LGA",
  description: "Sign in to the local government housing officer desk.",
};

const duties = [
  { n: "01", label: "Review housing applications" },
  { n: "02", label: "Update the property register" },
  { n: "03", label: "Publish allocation decisions" },
];

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-full flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="relative hidden overflow-hidden bg-forest-deep text-paper lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/hero/hero-apartments.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/75 to-forest-deep/45" />
        <div className="relative flex items-center justify-between px-10 pt-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center border border-paper/30 bg-forest text-paper">
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
                Housing authority
              </span>
            </span>
          </Link>
        </div>
        <div className="relative px-10 pb-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-copper-soft uppercase">
            Officer desk
          </p>
          <h2 className="mt-3 max-w-md font-display text-4xl leading-tight tracking-tight">
            Housing records for authorised staff.
          </h2>
          <ul className="mt-8 max-w-sm divide-y divide-white/15 border-y border-white/15">
            {duties.map((duty) => (
              <li key={duty.n} className="flex items-baseline gap-4 py-3">
                <span className="font-mono text-xs text-copper-soft">{duty.n}</span>
                <span className="text-sm text-sage">{duty.label}</span>
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
          Admin Login
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
          Sign in with your housing authority account to manage applications,
          property records, and allocations.
        </p>
        <div className="max-w-md">
          <AdminLoginForm />
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
