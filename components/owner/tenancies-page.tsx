"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { properties, tenancies as initialTenancies } from "./data";

type Tenancy = (typeof initialTenancies)[number];

const rentStatuses = ["Current", "Arrears"] as const;

const tone: Record<string, string> = {
  Current: "bg-sage text-forest",
  Arrears: "bg-copper-soft text-[#8a3d16]",
};

const fieldClass =
  "mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest";

const plotOptions = properties
  .filter((item) => item.status !== "Owner occupied")
  .map((item) => `${item.plot} · ${item.address}`);

type FieldErrors = {
  tenant?: string;
  plot?: string;
  since?: string;
  rent?: string;
  balance?: string;
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

function formatBalance(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "₦0";
  return `₦${Number(digits).toLocaleString("en-NG")}`;
}

export function TenanciesPage() {
  const [rows, setRows] = useState<Tenancy[]>(initialTenancies);
  const [open, setOpen] = useState(false);
  const [tenant, setTenant] = useState("");
  const [plot, setPlot] = useState("");
  const [since, setSince] = useState("");
  const [rent, setRent] = useState("");
  const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tenantRef = useRef<HTMLInputElement>(null);

  function close() {
    setTenant("");
    setPlot("");
    setSince("");
    setRent("");
    setBalance("");
    setErrors({});
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    tenantRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>("button, input, select"),
      ].filter((element) => !element.hasAttribute("disabled"));
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
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const nextTenant = tenant.trim();
    if (!nextTenant) nextErrors.tenant = "Enter the tenant name.";
    if (!plot) nextErrors.plot = "Choose a plot.";
    else if (rows.some((row) => row.plot === plot)) {
      nextErrors.plot = "This plot already has a tenancy on the list.";
    }
    if (!since.trim()) nextErrors.since = "Enter when the tenancy started.";
    if (!rent) nextErrors.rent = "Choose a rent status.";
    if (!balance.trim()) nextErrors.balance = "Enter the balance.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setRows((current) => [
      ...current,
      {
        tenant: nextTenant,
        plot,
        rent,
        balance: formatBalance(balance),
        since: since.trim(),
      },
    ]);
    close();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Tenancies
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
            Occupants on the plots you have let. Plot 3 is owner occupied and
            plot 12 is vacant.
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center bg-forest px-4 text-sm text-paper-raised hover:bg-forest-deep"
        >
          Add Tenant
        </button>
      </div>

      <ul className="mt-6 border border-line bg-paper-raised">
        {rows.map((row) => (
          <li
            key={`${row.tenant}-${row.plot}`}
            className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_8rem_7rem] md:items-center"
          >
            <div>
              <p className="font-medium">{row.tenant}</p>
              <p className="text-sm text-ink-muted">
                {row.plot} · since {row.since}
              </p>
            </div>
            <p className="text-sm">{row.balance}</p>
            <Status value={row.rent} />
          </li>
        ))}
      </ul>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <button
            type="button"
            aria-label="Close add tenant"
            className="fixed inset-0 bg-black/45"
            onClick={close}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-2xl rounded-[10px] border border-line bg-paper-raised p-6 shadow-[0_24px_60px_rgba(12,36,27,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={titleId}
                    className="font-display text-2xl tracking-tight"
                  >
                    Add new tenant
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Record who is letting one of your plots and their rent
                    standing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="grid size-10 shrink-0 place-items-center border border-line text-ink transition-colors hover:bg-ink hover:text-paper"
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

              <form
                onSubmit={onSubmit}
                noValidate
                className="mt-6 grid grid-cols-2 gap-4"
              >
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="tenant-name" className="text-sm font-medium">
                    Tenant
                  </label>
                  <input
                    ref={tenantRef}
                    id="tenant-name"
                    value={tenant}
                    onChange={(event) => setTenant(event.target.value)}
                    aria-invalid={errors.tenant ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.tenant ? (
                    <p className="mt-2 text-sm text-copper">{errors.tenant}</p>
                  ) : null}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="tenant-plot" className="text-sm font-medium">
                    Plot
                  </label>
                  <select
                    id="tenant-plot"
                    value={plot}
                    onChange={(event) => setPlot(event.target.value)}
                    aria-invalid={errors.plot ? true : undefined}
                    className={fieldClass}
                  >
                    <option value="">Select a plot</option>
                    {plotOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.plot ? (
                    <p className="mt-2 text-sm text-copper">{errors.plot}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="tenant-since" className="text-sm font-medium">
                    Since
                  </label>
                  <input
                    id="tenant-since"
                    value={since}
                    placeholder="March 2026"
                    onChange={(event) => setSince(event.target.value)}
                    aria-invalid={errors.since ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.since ? (
                    <p className="mt-2 text-sm text-copper">{errors.since}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="tenant-rent" className="text-sm font-medium">
                    Rent status
                  </label>
                  <select
                    id="tenant-rent"
                    value={rent}
                    onChange={(event) => setRent(event.target.value)}
                    aria-invalid={errors.rent ? true : undefined}
                    className={fieldClass}
                  >
                    <option value="">Select status</option>
                    {rentStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.rent ? (
                    <p className="mt-2 text-sm text-copper">{errors.rent}</p>
                  ) : null}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="tenant-balance"
                    className="text-sm font-medium"
                  >
                    Balance
                  </label>
                  <input
                    id="tenant-balance"
                    value={balance}
                    placeholder="0"
                    inputMode="numeric"
                    onChange={(event) => setBalance(event.target.value)}
                    aria-invalid={errors.balance ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.balance ? (
                    <p className="mt-2 text-sm text-copper">{errors.balance}</p>
                  ) : null}
                </div>
                <div className="col-span-2 mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="h-12 rounded-[10px] border border-line px-4 text-sm text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-12 rounded-[10px] bg-copper px-6 text-sm font-medium text-white hover:bg-[#a84c1e]"
                  >
                    Save tenant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
