"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { owner, properties as initialProperties } from "./data";

type Property = (typeof initialProperties)[number];

const statuses = ["Occupied", "Vacant", "Owner occupied"] as const;

const tone: Record<string, string> = {
  Occupied: "bg-sage text-forest",
  Registered: "bg-sage text-forest",
  "Owner occupied": "bg-forest text-paper",
  Vacant: "bg-line text-ink",
  "Update pending": "bg-copper-soft text-[#8a3d16]",
};

const fieldClass =
  "mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted";

type FieldErrors = {
  plot?: string;
  address?: string;
  use?: string;
  status?: string;
  occupant?: string;
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

export function PropertiesPage() {
  const [rows, setRows] = useState<Property[]>(initialProperties);
  const [open, setOpen] = useState(false);
  const [plot, setPlot] = useState("");
  const [address, setAddress] = useState("");
  const [use, setUse] = useState("");
  const [status, setStatus] = useState("");
  const [occupant, setOccupant] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const plotRef = useRef<HTMLInputElement>(null);
  const occupantLocked = status === "Vacant" || status === "Owner occupied";

  function close() {
    setPlot("");
    setAddress("");
    setUse("");
    setStatus("");
    setOccupant("");
    setErrors({});
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onStatus(nextStatus: string) {
    setStatus(nextStatus);
    if (nextStatus === "Vacant") setOccupant("");
    else if (nextStatus === "Owner occupied") setOccupant(owner.name);
    else if (status === "Owner occupied") setOccupant("");
  }

  useEffect(() => {
    if (!open) return;
    plotRef.current?.focus();

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
    const nextPlot = plot.trim();
    if (!nextPlot) nextErrors.plot = "Enter a plot number.";
    else if (
      rows.some((row) => row.plot.toLowerCase() === nextPlot.toLowerCase())
    ) {
      nextErrors.plot = "A property with this plot number already exists.";
    }
    if (!address.trim()) nextErrors.address = "Enter an address.";
    if (!use.trim()) nextErrors.use = "Enter how the property is used.";
    if (!status) nextErrors.status = "Choose a status.";
    else if (status === "Occupied" && !occupant.trim()) {
      nextErrors.occupant = "Enter the occupant.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setRows((current) => [
      ...current,
      {
        plot: nextPlot,
        address: address.trim(),
        use: use.trim(),
        status,
        occupant:
          status === "Owner occupied"
            ? owner.name
            : status === "Vacant"
              ? "—"
              : occupant.trim(),
        title: "Update pending",
      },
    ]);
    close();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Properties
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
            Plots registered with Nsukka Local Government in your name.
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center bg-forest px-4 text-sm text-paper-raised hover:bg-forest-deep"
        >
          Add Property
        </button>
      </div>

      <ul className="mt-6 border border-line bg-paper-raised">
        {rows.map((item) => (
          <li
            key={item.plot}
            className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_9rem_8rem] md:items-center"
          >
            <p className="font-display text-xl">{item.plot}</p>
            <div>
              <p className="font-medium">{item.address}</p>
              <p className="text-sm text-ink-muted">
                {item.use} · {item.occupant}
              </p>
            </div>
            <Status value={item.title} />
            <Status value={item.status} />
          </li>
        ))}
      </ul>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <button
            type="button"
            aria-label="Close add property"
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
                    Add new property
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    The plot is sent to the Nsukka housing desk as an update
                    pending review.
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

              <form onSubmit={onSubmit} noValidate className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="property-plot" className="text-sm font-medium">
                    Plot
                  </label>
                  <input
                    ref={plotRef}
                    id="property-plot"
                    value={plot}
                    onChange={(event) => setPlot(event.target.value)}
                    aria-invalid={errors.plot ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.plot ? (
                    <p className="mt-2 text-sm text-copper">{errors.plot}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="property-address" className="text-sm font-medium">
                    Address
                  </label>
                  <input
                    id="property-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    aria-invalid={errors.address ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.address ? (
                    <p className="mt-2 text-sm text-copper">{errors.address}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="property-use" className="text-sm font-medium">
                    Use
                  </label>
                  <input
                    id="property-use"
                    value={use}
                    onChange={(event) => setUse(event.target.value)}
                    aria-invalid={errors.use ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.use ? (
                    <p className="mt-2 text-sm text-copper">{errors.use}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="property-status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="property-status"
                    value={status}
                    onChange={(event) => onStatus(event.target.value)}
                    aria-invalid={errors.status ? true : undefined}
                    className={fieldClass}
                  >
                    <option value="">Select a status</option>
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.status ? (
                    <p className="mt-2 text-sm text-copper">{errors.status}</p>
                  ) : null}
                </div>
                <div className="col-span-2">
                  <label htmlFor="property-occupant" className="text-sm font-medium">
                    Occupant
                  </label>
                  <input
                    id="property-occupant"
                    value={status === "Owner occupied" ? owner.name : occupant}
                    disabled={occupantLocked}
                    onChange={(event) => setOccupant(event.target.value)}
                    aria-invalid={errors.occupant ? true : undefined}
                    className={fieldClass}
                  />
                  {errors.occupant ? (
                    <p className="mt-2 text-sm text-copper">{errors.occupant}</p>
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
                    Save property
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
