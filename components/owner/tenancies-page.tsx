"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { lgasForState, nigeriaStates } from "@/components/admin/nigeria-lgas";
import { properties, tenancies as initialTenancies } from "./data";

type Tenancy = (typeof initialTenancies)[number];

const tone: Record<string, string> = {
  Current: "bg-sage text-forest",
  Arrears: "bg-copper-soft text-[#8a3d16]",
};

const fieldClass =
  "mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest";

const genders = ["Male", "Female", "Prefer not to say"] as const;
const maritalStatuses = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
] as const;
const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Other",
] as const;
const propertyTypes = [
  "Flat",
  "House",
  "Bungalow",
  "Shop",
  "Office",
  "Warehouse",
  "Mixed use",
] as const;
const relationships = [
  "Spouse",
  "Parent",
  "Sibling",
  "Child",
  "Relative",
  "Friend",
  "Guardian",
  "Other",
] as const;

const plotOptions = properties
  .filter((item) => item.status !== "Owner occupied")
  .map((item) => ({
    value: `${item.plot} · ${item.address}`,
    label: `${item.plot} · ${item.address}`,
    use: item.use,
  }));

type FieldErrors = Partial<Record<string, string>>;

function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex w-fit px-2 py-1 text-xs ${tone[value] ?? "bg-line text-ink"}`}
    >
      {value}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm text-copper">{error}</p> : null}
    </div>
  );
}

function formatAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "₦0";
  return `₦${Number(digits).toLocaleString("en-NG")}`;
}

function formatDateLabel(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

const emptyForm = {
  surname: "",
  otherNames: "",
  personalEmail: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  occupation: "",
  employer: "",
  countryOfOrigin: "Nigeria",
  stateOfOrigin: "",
  localGovernment: "",
  homeTown: "",
  dependents: "",
  property: "",
  unitNumber: "",
  propertyType: "",
  startDate: "",
  endDate: "",
  amountPaid: "",
  balance: "",
  kinName: "",
  kinRelationship: "",
  kinPhone: "",
  kinAddress: "",
  loginEmail: "",
  password: "",
};

export function TenanciesPage() {
  const [rows, setRows] = useState<Tenancy[]>(initialTenancies);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const originLgas = lgasForState(form.stateOfOrigin);

  function setField<K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function close() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setForm(emptyForm);
    setShowPassword(false);
    setErrors({});
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    surnameRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>(
          "button, input, select, textarea",
        ),
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

  function onAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const surname = form.surname.trim();
    const otherNames = form.otherNames.trim();
    const personalEmail = form.personalEmail.trim();
    const loginEmail = form.loginEmail.trim();

    if (!surname) nextErrors.surname = "Enter a surname.";
    if (!otherNames) nextErrors.otherNames = "Enter other names.";
    if (!personalEmail) nextErrors.personalEmail = "Enter an email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmail)) {
      nextErrors.personalEmail = "Enter a valid email.";
    }
    if (!form.phone.trim()) nextErrors.phone = "Enter a phone number.";
    if (!form.gender) nextErrors.gender = "Choose a gender.";
    if (!form.dateOfBirth) nextErrors.dateOfBirth = "Enter date of birth.";
    if (!form.maritalStatus) {
      nextErrors.maritalStatus = "Choose a marital status.";
    }
    if (!form.occupation.trim()) nextErrors.occupation = "Enter occupation.";
    if (!form.countryOfOrigin) {
      nextErrors.countryOfOrigin = "Choose a country of origin.";
    }
    if (form.countryOfOrigin === "Nigeria") {
      if (!form.stateOfOrigin) {
        nextErrors.stateOfOrigin = "Choose a state of origin.";
      }
      if (!form.localGovernment) {
        nextErrors.localGovernment = "Choose a local government.";
      }
    }
    if (!form.homeTown.trim()) nextErrors.homeTown = "Enter a home town.";
    if (!form.dependents.trim()) {
      nextErrors.dependents = "Enter number of dependents.";
    }
    if (!form.property) nextErrors.property = "Choose a property.";
    else if (rows.some((row) => row.plot === form.property)) {
      nextErrors.property = "This property already has a tenancy on the list.";
    }
    if (!form.unitNumber.trim()) {
      nextErrors.unitNumber = "Enter a unit, flat, or shop number.";
    }
    if (!form.propertyType) {
      nextErrors.propertyType = "Choose a type of property.";
    }
    if (!form.startDate) nextErrors.startDate = "Enter tenancy start date.";
    if (!form.endDate) nextErrors.endDate = "Enter tenancy end date.";
    if (!form.amountPaid.trim()) {
      nextErrors.amountPaid = "Enter total amount paid.";
    }
    if (!form.balance.trim()) {
      nextErrors.balance = "Enter outstanding balance.";
    }
    if (!form.kinName.trim()) nextErrors.kinName = "Enter next of kin name.";
    if (!form.kinRelationship) {
      nextErrors.kinRelationship = "Choose a relationship.";
    }
    if (!form.kinPhone.trim()) nextErrors.kinPhone = "Enter a phone number.";
    if (!form.kinAddress.trim()) nextErrors.kinAddress = "Enter an address.";
    if (!loginEmail) nextErrors.loginEmail = "Enter a login email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      nextErrors.loginEmail = "Enter a valid email.";
    }
    if (!form.password) nextErrors.password = "Enter a password.";
    else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const balanceValue = Number(form.balance.replace(/[^\d]/g, "") || "0");
    setRows((current) => [
      ...current,
      {
        tenant: `${otherNames} ${surname}`.trim(),
        plot: `${form.property} · Unit ${form.unitNumber.trim()}`,
        rent: balanceValue > 0 ? "Arrears" : "Current",
        balance: formatAmount(form.balance),
        since: formatDateLabel(form.startDate),
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
          <div className="flex min-h-full items-start justify-center p-4 py-8 sm:items-center">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-[10px] border border-line bg-paper-raised p-6 shadow-[0_24px_60px_rgba(12,36,27,0.28)] sm:p-8"
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
                    Capture personal details, tenancy terms, emergency contact,
                    and portal login for this occupant.
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
                className="mt-8 flex flex-col gap-8"
              >
                <Section title="Personal information">
                  <div className="col-span-full flex flex-col items-center gap-3 pb-2">
                    <input
                      ref={avatarInputRef}
                      id="tenant-avatar"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onAvatarChange}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="grid size-24 place-items-center overflow-hidden rounded-full border border-dashed border-line bg-paper text-ink-muted transition-colors hover:border-forest hover:text-forest"
                      aria-label="Upload avatar"
                    >
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarPreview}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="size-8"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                          />
                          <path
                            fill="currentColor"
                            d="M19 8h-1V7h-2v1h-1v2h1v1h2v-1h1V8Z"
                          />
                        </svg>
                      )}
                    </button>
                    <p className="text-xs text-ink-muted">Upload avatar</p>
                  </div>

                  <Field id="tenant-surname" label="Surname" error={errors.surname}>
                    <input
                      ref={surnameRef}
                      id="tenant-surname"
                      value={form.surname}
                      onChange={(event) =>
                        setField("surname", event.target.value)
                      }
                      aria-invalid={errors.surname ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-other-names"
                    label="Other names"
                    error={errors.otherNames}
                  >
                    <input
                      id="tenant-other-names"
                      value={form.otherNames}
                      onChange={(event) =>
                        setField("otherNames", event.target.value)
                      }
                      aria-invalid={errors.otherNames ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-personal-email"
                    label="Email"
                    error={errors.personalEmail}
                  >
                    <input
                      id="tenant-personal-email"
                      type="email"
                      value={form.personalEmail}
                      onChange={(event) =>
                        setField("personalEmail", event.target.value)
                      }
                      aria-invalid={errors.personalEmail ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="tenant-phone" label="Phone" error={errors.phone}>
                    <input
                      id="tenant-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      aria-invalid={errors.phone ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="tenant-gender" label="Gender" error={errors.gender}>
                    <select
                      id="tenant-gender"
                      value={form.gender}
                      onChange={(event) =>
                        setField("gender", event.target.value)
                      }
                      aria-invalid={errors.gender ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select gender</option>
                      {genders.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="tenant-dob"
                    label="Date of birth"
                    error={errors.dateOfBirth}
                  >
                    <input
                      id="tenant-dob"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) =>
                        setField("dateOfBirth", event.target.value)
                      }
                      aria-invalid={errors.dateOfBirth ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-marital"
                    label="Marital status"
                    error={errors.maritalStatus}
                  >
                    <select
                      id="tenant-marital"
                      value={form.maritalStatus}
                      onChange={(event) =>
                        setField("maritalStatus", event.target.value)
                      }
                      aria-invalid={errors.maritalStatus ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select marital status</option>
                      {maritalStatuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="tenant-occupation"
                    label="Occupation"
                    error={errors.occupation}
                  >
                    <input
                      id="tenant-occupation"
                      value={form.occupation}
                      onChange={(event) =>
                        setField("occupation", event.target.value)
                      }
                      aria-invalid={errors.occupation ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-employer"
                    label="Employer / Business name"
                    error={errors.employer}
                    className="sm:col-span-2"
                  >
                    <input
                      id="tenant-employer"
                      value={form.employer}
                      onChange={(event) =>
                        setField("employer", event.target.value)
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-country"
                    label="Country of origin"
                    error={errors.countryOfOrigin}
                  >
                    <select
                      id="tenant-country"
                      value={form.countryOfOrigin}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          countryOfOrigin: event.target.value,
                          stateOfOrigin: "",
                          localGovernment: "",
                        }));
                      }}
                      aria-invalid={errors.countryOfOrigin ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select country</option>
                      {countries.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="tenant-state-origin"
                    label="State of origin"
                    error={errors.stateOfOrigin}
                  >
                    {form.countryOfOrigin === "Nigeria" ? (
                      <select
                        id="tenant-state-origin"
                        value={form.stateOfOrigin}
                        onChange={(event) => {
                          setForm((current) => ({
                            ...current,
                            stateOfOrigin: event.target.value,
                            localGovernment: "",
                          }));
                        }}
                        aria-invalid={errors.stateOfOrigin ? true : undefined}
                        className={fieldClass}
                      >
                        <option value="">Select state</option>
                        {nigeriaStates.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="tenant-state-origin"
                        value={form.stateOfOrigin}
                        onChange={(event) =>
                          setField("stateOfOrigin", event.target.value)
                        }
                        aria-invalid={errors.stateOfOrigin ? true : undefined}
                        className={fieldClass}
                      />
                    )}
                  </Field>
                  <Field
                    id="tenant-lga-origin"
                    label="Local government / District / Province"
                    error={errors.localGovernment}
                  >
                    {form.countryOfOrigin === "Nigeria" ? (
                      <select
                        id="tenant-lga-origin"
                        value={form.localGovernment}
                        disabled={!form.stateOfOrigin}
                        onChange={(event) =>
                          setField("localGovernment", event.target.value)
                        }
                        aria-invalid={errors.localGovernment ? true : undefined}
                        className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted`}
                      >
                        <option value="">Select local government</option>
                        {originLgas.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="tenant-lga-origin"
                        value={form.localGovernment}
                        onChange={(event) =>
                          setField("localGovernment", event.target.value)
                        }
                        aria-invalid={errors.localGovernment ? true : undefined}
                        className={fieldClass}
                      />
                    )}
                  </Field>
                  <Field
                    id="tenant-hometown"
                    label="Home town"
                    error={errors.homeTown}
                  >
                    <input
                      id="tenant-hometown"
                      value={form.homeTown}
                      onChange={(event) =>
                        setField("homeTown", event.target.value)
                      }
                      aria-invalid={errors.homeTown ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-dependents"
                    label="Number of children / dependents"
                    error={errors.dependents}
                  >
                    <input
                      id="tenant-dependents"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={form.dependents}
                      onChange={(event) =>
                        setField("dependents", event.target.value)
                      }
                      aria-invalid={errors.dependents ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                </Section>

                <Section title="Tenancy information">
                  <Field
                    id="tenant-property"
                    label="Property"
                    error={errors.property}
                  >
                    <select
                      id="tenant-property"
                      value={form.property}
                      onChange={(event) => {
                        const next = event.target.value;
                        const match = plotOptions.find(
                          (item) => item.value === next,
                        );
                        setForm((current) => ({
                          ...current,
                          property: next,
                          propertyType:
                            current.propertyType ||
                            (match?.use.toLowerCase().includes("shop")
                              ? "Shop"
                              : current.propertyType),
                        }));
                      }}
                      aria-invalid={errors.property ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select property</option>
                      {plotOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="tenant-unit"
                    label="Unit / Flat / Shop number"
                    error={errors.unitNumber}
                  >
                    <input
                      id="tenant-unit"
                      value={form.unitNumber}
                      onChange={(event) =>
                        setField("unitNumber", event.target.value)
                      }
                      aria-invalid={errors.unitNumber ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-property-type"
                    label="Type of property"
                    error={errors.propertyType}
                  >
                    <select
                      id="tenant-property-type"
                      value={form.propertyType}
                      onChange={(event) =>
                        setField("propertyType", event.target.value)
                      }
                      aria-invalid={errors.propertyType ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select type of property</option>
                      {propertyTypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="tenant-start"
                    label="Tenancy start date"
                    error={errors.startDate}
                  >
                    <input
                      id="tenant-start"
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        setField("startDate", event.target.value)
                      }
                      aria-invalid={errors.startDate ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-end"
                    label="Tenancy end date"
                    error={errors.endDate}
                  >
                    <input
                      id="tenant-end"
                      type="date"
                      value={form.endDate}
                      onChange={(event) =>
                        setField("endDate", event.target.value)
                      }
                      aria-invalid={errors.endDate ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-amount-paid"
                    label="Total amount paid"
                    error={errors.amountPaid}
                  >
                    <input
                      id="tenant-amount-paid"
                      inputMode="numeric"
                      value={form.amountPaid}
                      onChange={(event) =>
                        setField("amountPaid", event.target.value)
                      }
                      aria-invalid={errors.amountPaid ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-balance"
                    label="Outstanding balance"
                    error={errors.balance}
                    className="sm:col-span-2"
                  >
                    <input
                      id="tenant-balance"
                      inputMode="numeric"
                      value={form.balance}
                      onChange={(event) =>
                        setField("balance", event.target.value)
                      }
                      aria-invalid={errors.balance ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                </Section>

                <Section title="Next of kin / Emergency contact">
                  <Field
                    id="kin-name"
                    label="Full name"
                    error={errors.kinName}
                  >
                    <input
                      id="kin-name"
                      value={form.kinName}
                      onChange={(event) =>
                        setField("kinName", event.target.value)
                      }
                      aria-invalid={errors.kinName ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="kin-relationship"
                    label="Relationship to tenant"
                    error={errors.kinRelationship}
                  >
                    <select
                      id="kin-relationship"
                      value={form.kinRelationship}
                      onChange={(event) =>
                        setField("kinRelationship", event.target.value)
                      }
                      aria-invalid={errors.kinRelationship ? true : undefined}
                      className={fieldClass}
                    >
                      <option value="">Select relationship</option>
                      {relationships.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="kin-phone"
                    label="Phone number"
                    error={errors.kinPhone}
                  >
                    <input
                      id="kin-phone"
                      type="tel"
                      value={form.kinPhone}
                      onChange={(event) =>
                        setField("kinPhone", event.target.value)
                      }
                      aria-invalid={errors.kinPhone ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="kin-address"
                    label="Address"
                    error={errors.kinAddress}
                    className="sm:col-span-2"
                  >
                    <textarea
                      id="kin-address"
                      rows={3}
                      value={form.kinAddress}
                      onChange={(event) =>
                        setField("kinAddress", event.target.value)
                      }
                      aria-invalid={errors.kinAddress ? true : undefined}
                      className="mt-2 w-full rounded-[10px] border border-line bg-paper px-3 py-3 text-sm outline-none focus:border-forest"
                    />
                  </Field>
                </Section>

                <Section title="Tenant login details">
                  <Field
                    id="tenant-login-email"
                    label="Email address"
                    error={errors.loginEmail}
                  >
                    <input
                      id="tenant-login-email"
                      type="email"
                      autoComplete="off"
                      value={form.loginEmail}
                      onChange={(event) =>
                        setField("loginEmail", event.target.value)
                      }
                      aria-invalid={errors.loginEmail ? true : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    id="tenant-login-password"
                    label="Password"
                    error={errors.password}
                  >
                    <div className="relative mt-2">
                      <input
                        id="tenant-login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          setField("password", event.target.value)
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
                  </Field>
                </Section>

                <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
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
