"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createLga, deleteLga, updateLga } from "@/app/super-admin/lgas/actions";
import { createLgaId } from "@/lib/lga-id";
import { nigeriaLgas, nigeriaStates } from "./nigeria-lgas";

const statuses = ["Onboarding", "Active"] as const;

export type LgaRow = {
  id: string;
  code: string;
  name: string;
  state: string;
  chairman: string;
  status: string;
};

type FieldErrors = {
  name?: string;
  state?: string;
  chairman?: string;
  code?: string;
  status?: string;
};

type DialogMode = "add" | "edit" | "delete" | null;

export function LgasPage({ lgas }: { lgas: LgaRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<LgaRow[]>(lgas);
  const [mode, setMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<LgaRow | null>(null);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [chairman, setChairman] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [deleteError, setDeleteError] = useState("");
  const titleId = useId();
  const deleteTitleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const editing = mode === "edit";
  const localGovernments =
    stateName in nigeriaLgas
      ? nigeriaLgas[stateName as keyof typeof nigeriaLgas]
      : [];

  function close() {
    setName("");
    setStateName("");
    setChairman("");
    setCode("");
    setStatus("");
    setErrors({});
    setDeleteError("");
    setSelected(null);
    setMode(null);
    returnFocusRef.current?.focus();
  }

  function openAdd() {
    returnFocusRef.current = triggerRef.current;
    setSelected(null);
    setName("");
    setStateName("");
    setChairman("");
    setCode(createLgaId());
    setStatus("");
    setErrors({});
    setMode("add");
  }

  function openEdit(area: LgaRow, button: HTMLElement) {
    returnFocusRef.current = button;
    setSelected(area);
    setName(area.name);
    setStateName(area.state);
    setChairman(area.chairman === "—" ? "" : area.chairman);
    setCode(area.code);
    setStatus(area.status);
    setErrors({});
    setMode("edit");
  }

  function openDelete(area: LgaRow, button: HTMLElement) {
    returnFocusRef.current = button;
    setSelected(area);
    setDeleteError("");
    setMode("delete");
  }

  useEffect(() => {
    setRows(lgas);
  }, [lgas]);

  useEffect(() => {
    if (!mode) return;
    if (mode === "add" || mode === "edit") stateRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog =
        mode === "delete" ? deleteDialogRef.current : dialogRef.current;
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
  }, [mode]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!stateName) nextErrors.state = "Choose a state.";
    if (!name) nextErrors.name = "Choose a local government.";
    else if (
      !localGovernments.includes(name as (typeof localGovernments)[number])
    ) {
      nextErrors.name = "Choose a local government in the selected state.";
    } else if (
      rows.some(
        (row) =>
          row.id !== selected?.id &&
          row.name === name &&
          row.state === stateName,
      )
    ) {
      nextErrors.name = "This LGA is already on the list.";
    }
    if (!chairman.trim()) nextErrors.chairman = "Enter a chairman.";
    if (editing && !status) nextErrors.status = "Choose a status.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const result = editing
        ? await updateLga({
            id: selected?.id ?? "",
            name,
            state: stateName,
            chairman,
            status,
          })
        : await createLga({
            name,
            state: stateName,
            chairman,
            code,
          });
      if (!result.ok) {
        setErrors({ [result.field]: result.message });
        return;
      }
      close();
      router.refresh();
    } catch {
      setErrors({
        name: editing
          ? "Could not update this LGA. Try again."
          : "Could not save this LGA. Try again.",
      });
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!selected) return;
    setPending(true);
    setDeleteError("");
    try {
      const result = await deleteLga(selected.id);
      if (!result.ok) {
        setDeleteError(result.message);
        return;
      }
      close();
      router.refresh();
    } catch {
      setDeleteError("Could not delete this LGA. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">LGAs</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
            Local government areas on the housing portal.
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 items-center justify-center bg-forest px-4 text-sm text-paper-raised hover:bg-forest-deep"
        >
          Add LGA
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 border border-line bg-paper-raised px-4 py-6 text-sm text-ink-muted">
          No local government areas yet.
        </p>
      ) : (
        <ul className="mt-6 border border-line bg-paper-raised">
          {rows.map((area) => (
            <li
              key={area.id}
              className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_9rem_10rem_7rem_auto] md:items-center"
            >
              <div>
                <p className="font-medium">{area.name}</p>
                <p className="text-sm text-ink-muted">{area.state}</p>
              </div>
              <p className="font-mono text-sm">{area.code}</p>
              <p className="text-sm">{area.chairman}</p>
              <span
                className={`inline-flex w-fit px-2 py-1 text-xs ${
                  area.status === "Onboarding"
                    ? "bg-line text-ink"
                    : "bg-sage text-forest"
                }`}
              >
                {area.status}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(event) => openEdit(area, event.currentTarget)}
                  className="h-9 border border-line px-3 text-sm text-ink hover:bg-paper"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => openDelete(area, event.currentTarget)}
                  className="h-9 border border-copper-soft px-3 text-sm text-copper hover:bg-copper hover:text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {mode === "add" || mode === "edit" ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <button
            type="button"
            aria-label={editing ? "Close edit LGA" : "Close add LGA"}
            className="fixed inset-0 bg-black/45"
            onClick={close}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-lg border border-line bg-paper-raised p-6 shadow-[0_24px_60px_rgba(12,36,27,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={titleId}
                    className="font-display text-2xl tracking-tight"
                  >
                    {editing ? "Edit LGA" : "Add LGA"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {editing
                      ? "The LGA ID stays the same, so assigned accounts remain linked to this local government."
                      : "The LGA ID is created automatically. Accounts assigned to it only see this local government."}
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

              <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="lga-code" className="text-sm font-medium">
                    LGA ID
                  </label>
                  <input
                    id="lga-code"
                    value={code}
                    readOnly
                    aria-invalid={errors.code ? true : undefined}
                    className="mt-2 h-12 w-full border border-line bg-paper px-3 font-mono text-sm text-ink outline-none"
                  />
                  {errors.code ? (
                    <p className="mt-2 text-sm text-copper">{errors.code}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lga-state" className="text-sm font-medium">
                    State
                  </label>
                  <select
                    ref={stateRef}
                    id="lga-state"
                    value={stateName}
                    onChange={(event) => {
                      setStateName(event.target.value);
                      setName("");
                    }}
                    aria-invalid={errors.state ? true : undefined}
                    className="mt-2 h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
                  >
                    <option value="">Select a state</option>
                    {nigeriaStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state ? (
                    <p className="mt-2 text-sm text-copper">{errors.state}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lga-name" className="text-sm font-medium">
                    Name
                  </label>
                  <select
                    id="lga-name"
                    value={name}
                    disabled={!stateName}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    className="mt-2 h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-forest disabled:text-ink-muted"
                  >
                    <option value="">
                      {stateName
                        ? "Select a local government"
                        : "Select a state first"}
                    </option>
                    {localGovernments.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.name ? (
                    <p className="mt-2 text-sm text-copper">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lga-chairman" className="text-sm font-medium">
                    Chairman
                  </label>
                  <input
                    id="lga-chairman"
                    value={chairman}
                    onChange={(event) => setChairman(event.target.value)}
                    aria-invalid={errors.chairman ? true : undefined}
                    className="mt-2 h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
                  />
                  {errors.chairman ? (
                    <p className="mt-2 text-sm text-copper">{errors.chairman}</p>
                  ) : null}
                </div>
                {editing ? (
                  <div>
                    <label htmlFor="lga-status" className="text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="lga-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      aria-invalid={errors.status ? true : undefined}
                      className="mt-2 h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
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
                ) : null}
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="h-12 border border-line px-4 text-sm text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="h-12 bg-copper px-6 text-sm font-medium text-white hover:bg-[#a84c1e] disabled:opacity-60"
                  >
                    {pending ? "Saving…" : editing ? "Save changes" : "Save LGA"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "delete" && selected ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <button
            type="button"
            aria-label="Close delete LGA"
            className="fixed inset-0 bg-black/45"
            onClick={close}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              ref={deleteDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={deleteTitleId}
              className="relative w-full max-w-lg border border-line bg-paper-raised p-6 shadow-[0_24px_60px_rgba(12,36,27,0.28)]"
            >
              <h2
                id={deleteTitleId}
                className="font-display text-2xl tracking-tight"
              >
                Delete LGA
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Delete {selected.name}? Accounts assigned to {selected.code}{" "}
                will no longer be limited to this local government.
              </p>
              {deleteError ? (
                <p className="mt-3 text-sm text-copper">{deleteError}</p>
              ) : null}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="h-12 border border-line px-4 text-sm text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={pending}
                  className="h-12 bg-copper px-6 text-sm font-medium text-white hover:bg-[#a84c1e] disabled:opacity-60"
                >
                  {pending ? "Deleting…" : "Delete LGA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
