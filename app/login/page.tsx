import Link from "next/link";

export const metadata = {
  title: "Log in — Expert LGA",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
        Expert LGA
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-ink">
        Log in
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Resident and officer sign-in will open here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center bg-forest px-5 text-sm text-paper-raised"
      >
        Back to home
      </Link>
    </main>
  );
}
