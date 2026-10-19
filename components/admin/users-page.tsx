"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/app/super-admin/users/actions";

const roles = [
  "Super Admin",
  "Admin",
  "LGA Chairman",
  "Property Owner",
] as const;

const statuses = ["Active", "Invited"] as const;

export type LgaOption = {
  id: string;
  name: string;
  state: string;
  code: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lgaId: string | null;
  lgaCode: string | null;
};

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  lga?: string;
};

type DialogMode = "add" | "edit" | "delete" | null;

export function UsersPage({
  users,
  lgas,
}: {
  users: UserRow[];
  lgas: LgaOption[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<UserRow[]>(users);
  const [mode, setMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [lgaId, setLgaId] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [deleteError, setDeleteError] = useState("");
  const titleId = useId();
  const deleteTitleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lgaLocked = role === "Super Admin" || role === "Admin";
  const editing = mode === "edit";

  function close() {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRole("");
    setStatus("");
    setLgaId("");
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
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRole("");
    setStatus("");
    setLgaId("");
    setErrors({});
    setMode("add");
  }

  function openEdit(user: UserRow, button: HTMLElement) {
    returnFocusRef.current = button;
    setSelected(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setShowPassword(false);
    setRole(user.role);
    setStatus(user.status);
    setLgaId(user.lgaId ?? "");
    setErrors({});
    setMode("edit");
  }

  function openDelete(user: UserRow, button: HTMLElement) {
    returnFocusRef.current = button;
    setSelected(user);
    setDeleteError("");
    setMode("delete");
  }

  useEffect(() => {
    setRows(users);
  }, [users]);

  useEffect(() => {
    if (!mode) return;

    if (mode === "add" || mode === "edit") nameRef.current?.focus();

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
    if (!name.trim()) nextErrors.name = "Enter a name.";
    if (!email.trim()) nextErrors.email = "Enter an email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email.";
    } else if (
      rows.some(
        (row) =>
          row.id !== selected?.id &&
          row.email.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      nextErrors.email = "A user with this email already exists.";
    }
    if (!editing && !password) nextErrors.password = "Enter a password.";
    else if (!editing && password.length > 6) {
      nextErrors.password = "Password must be at most 6 characters.";
    } else if (editing && password && password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!role) nextErrors.role = "Choose a role.";
    else if (role !== "Super Admin" && role !== "Admin" && !lgaId) {
      nextErrors.lga = "Choose an LGA.";
    }
    if (editing && !status) nextErrors.status = "Choose a status.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const result = editing
        ? await updateUser({
            id: selected?.id ?? "",
            name,
            email,
            password,
            role,
            status,
            lgaId,
          })
        : await createUser({ name, email, password, role, lgaId });
      if (!result.ok) {
        setErrors({ [result.field]: result.message });
        return;
      }
      close();
      router.refresh();
    } catch {
      setErrors({
        email: editing
          ? "Could not update this user. Try again."
          : "Could not save this user. Try again.",
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
      const result = await deleteUser(selected.id);
      if (!result.ok) {
        setDeleteError(result.message);
        return;
      }
      close();
      router.refresh();
    } catch {
      setDeleteError("Could not delete this user. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Users</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
            Officers, tenants, and property owners who can sign in to the portal.
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 items-center justify-center bg-forest px-4 text-sm text-paper-raised hover:bg-forest-deep"
        >
          Add User
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 border border-line bg-paper-raised px-4 py-6 text-sm text-ink-muted">
          No users yet.
        </p>
      ) : (
        <ul className="mt-6 border border-line bg-paper-raised">
          {rows.map((user) => (
            <li
              key={user.id}
              className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_10rem_7rem_auto] md:items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-ink-muted">{user.email}</p>
                <p className="text-sm text-ink-muted">
                  {user.role === "Super Admin" || user.role === "Admin"
                    ? "All local governments"
                    : (user.lgaCode ?? "No LGA")}
                </p>
              </div>
              <p className="text-sm">{user.role}</p>
              <span
                className={`inline-flex w-fit px-2 py-1 text-xs ${
                  user.status === "Invited"
                    ? "bg-line text-ink"
                    : "bg-sage text-forest"
                }`}
              >
                {user.status}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(event) => openEdit(user, event.currentTarget)}
                  className="h-9 border border-line px-3 text-sm text-ink hover:bg-paper"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => openDelete(user, event.currentTarget)}
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
            aria-label={editing ? "Close edit user" : "Close add user"}
            className="fixed inset-0 bg-black/45"
            onClick={close}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-[70vw] rounded-[10px] border border-line bg-paper-raised p-6 shadow-[0_24px_60px_rgba(12,36,27,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={titleId}
                    className="font-display text-2xl tracking-tight"
                  >
                    {editing ? "Edit User" : "Add User"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {editing
                      ? "Update this account. Leave the password blank to keep the current one."
                      : "The new account is saved as invited until they sign in."}
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
                <div>
                  <label htmlFor="user-name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    ref={nameRef}
                    id="user-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
                  />
                  {errors.name ? (
                    <p className="mt-2 text-sm text-copper">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="user-email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
                  />
                  {errors.email ? (
                    <p className="mt-2 text-sm text-copper">{errors.email}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="user-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={editing ? undefined : 6}
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          editing
                            ? event.target.value
                            : event.target.value.slice(0, 6),
                        )
                      }
                      aria-invalid={errors.password ? true : undefined}
                      className="h-12 w-full rounded-[10px] border border-line bg-paper px-3 pr-16 text-sm outline-none focus:border-forest"
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
                    <p className="mt-2 text-sm text-copper">{errors.password}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="user-role" className="text-sm font-medium">
                    Role
                  </label>
                  <select
                    id="user-role"
                    value={role}
                    onChange={(event) => {
                      const nextRole = event.target.value;
                      setRole(nextRole);
                      if (nextRole === "Super Admin" || nextRole === "Admin") {
                        setLgaId("");
                      }
                    }}
                    aria-invalid={errors.role ? true : undefined}
                    className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
                  >
                    <option value="">Select a role</option>
                    {roles.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.role ? (
                    <p className="mt-2 text-sm text-copper">{errors.role}</p>
                  ) : null}
                </div>
                {editing ? (
                  <div>
                    <label htmlFor="user-status" className="text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="user-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      aria-invalid={errors.status ? true : undefined}
                      className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
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
                <div className="col-span-2">
                  <label htmlFor="user-lga" className="text-sm font-medium">
                    LGA
                  </label>
                  <select
                    id="user-lga"
                    value={lgaLocked ? "" : lgaId}
                    disabled={lgaLocked}
                    onChange={(event) => setLgaId(event.target.value)}
                    aria-invalid={errors.lga ? true : undefined}
                    className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
                  >
                    <option value="">Select an LGA</option>
                    {lgas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}, {area.state} · {area.code}
                      </option>
                    ))}
                  </select>
                  {errors.lga ? (
                    <p className="mt-2 text-sm text-copper">{errors.lga}</p>
                  ) : null}
                </div>
                <div className="col-span-2 mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                    {pending
                      ? "Saving…"
                      : editing
                        ? "Save changes"
                        : "Save user"}
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
            aria-label="Close delete user"
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
                Delete user
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Delete {selected.name}? This removes {selected.email} from the
                portal.
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
                  {pending ? "Deleting…" : "Delete user"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
