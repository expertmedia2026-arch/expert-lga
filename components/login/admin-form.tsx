"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type FieldErrors = {
  email?: string;
  password?: string;
};

const demoAdmin = {
  email: "amina@lga.gov",
  password: "demo1234",
};

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(nextEmail: string, nextPassword: string) {
    const nextErrors: FieldErrors = {};
    if (!nextEmail.trim()) {
      nextErrors.email = "Enter your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail.trim())) {
      nextErrors.email = "Enter a valid work email.";
    }
    if (!nextPassword) {
      nextErrors.password = "Enter your password.";
    } else if (nextPassword.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    return nextErrors;
  }

  function fillDemo() {
    setEmail(demoAdmin.email);
    setPassword(demoAdmin.password);
    setErrors({});
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      router.push("/super-admin");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
      <div className="border border-line bg-paper-raised px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              Demo login
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Amina Yusuf · Housing officer
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="shrink-0 text-xs font-medium tracking-wide text-forest uppercase hover:text-copper"
          >
            Use demo
          </button>
        </div>
        <dl className="mt-3 grid gap-2 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-ink-muted">Email</dt>
            <dd className="font-mono text-ink">{demoAdmin.email}</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-ink-muted">Password</dt>
            <dd className="font-mono text-ink">{demoAdmin.password}</dd>
          </div>
        </dl>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="name@lga.gov"
          className="mt-2 h-12 w-full border border-line bg-paper-raised px-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-forest"
        />
        {errors.email ? (
          <p id="email-error" className="mt-2 text-sm text-copper">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-12 w-full border border-line bg-paper-raised px-3 pr-16 text-sm text-ink outline-none focus:border-forest"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium tracking-wide text-ink-muted uppercase hover:text-ink"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="mt-2 text-sm text-copper">
            {errors.password}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-1 h-12 bg-forest text-sm font-medium text-paper-raised transition-colors hover:bg-forest-deep"
      >
        Sign in
      </button>

      <p className="text-sm text-ink-muted">
        Tenant?{" "}
        <Link href="/login/tenant" className="font-medium text-forest underline-offset-4 hover:underline">
          Tenant login
        </Link>
      </p>
    </form>
  );
}
