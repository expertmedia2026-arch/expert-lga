"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function TenantLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(nextEmail: string, nextPassword: string) {
    const nextErrors: FieldErrors = {};
    if (!nextEmail.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail.trim())) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!nextPassword) {
      nextErrors.password = "Enter your password.";
    } else if (nextPassword.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    return nextErrors;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(validate(email, password));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="tenant-email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="tenant-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "tenant-email-error" : undefined}
          placeholder="you@email.com"
          className="mt-2 h-12 w-full border border-line bg-paper-raised px-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-ink"
        />
        {errors.email ? (
          <p id="tenant-email-error" className="mt-2 text-sm text-copper">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="tenant-password"
          className="text-sm font-medium text-ink"
        >
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="tenant-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "tenant-password-error" : undefined
            }
            className="h-12 w-full border border-line bg-paper-raised px-3 pr-16 text-sm text-ink outline-none focus:border-ink"
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
          <p id="tenant-password-error" className="mt-2 text-sm text-copper">
            {errors.password}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-1 h-12 bg-ink text-sm font-medium text-paper-raised transition-colors hover:bg-forest-deep"
      >
        Sign in
      </button>

      <div className="flex flex-col gap-2 text-sm text-ink-muted">
        <p>
          Property owner?{" "}
          <Link
            href="/login/property-owner"
            className="font-medium text-forest underline-offset-4 hover:underline"
          >
            Property Owner Login
          </Link>
        </p>
        <p>
          Housing staff?{" "}
          <Link
            href="/login/admin"
            className="font-medium text-forest underline-offset-4 hover:underline"
          >
            Admin Login
          </Link>
        </p>
      </div>
    </form>
  );
}
