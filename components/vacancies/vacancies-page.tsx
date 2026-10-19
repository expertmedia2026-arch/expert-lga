"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  vacancies as allVacancies,
  vacancyLgas,
  vacancyTypes,
  type Vacancy,
} from "./data";

const statusTone: Record<Vacancy["status"], string> = {
  Open: "bg-sage text-forest",
  "Closing soon": "bg-copper-soft text-[#8a3d16]",
  Waitlist: "bg-line text-ink",
};

function Status({ value }: { value: Vacancy["status"] }) {
  return (
    <span className={`inline-flex w-fit px-2 py-1 text-xs ${statusTone[value]}`}>
      {value}
    </span>
  );
}

export function VacanciesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof vacancyTypes)[number]>("All types");
  const [lga, setLga] = useState<(typeof vacancyLgas)[number]>("All LGAs");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allVacancies.filter((item) => {
      if (type !== "All types" && item.type !== type) return false;
      if (lga !== "All LGAs" && item.lga !== lga) return false;
      if (!needle) return true;
      const haystack =
        `${item.id} ${item.title} ${item.lga} ${item.state} ${item.ward} ${item.type} ${item.summary}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, type, lga]);

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="relative overflow-hidden border-b border-line bg-forest-deep text-paper">
        <Image
          src="/hero/hero-new-homes.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/80 to-forest-deep/50" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex items-center justify-between gap-4">
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
                  Housing vacancies
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/login/tenant"
                className="hidden text-sage hover:text-paper sm:inline"
              >
                Tenant login
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center border border-paper/25 px-3 text-paper hover:bg-white/10"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="max-w-2xl pb-4 lg:pb-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-copper-soft uppercase">
              Open allocations
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Vacancies
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-sage">
              Social housing, staff quarters, and commercial units currently
              open across participating local governments.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 border border-line bg-paper-raised p-4 sm:flex-row sm:items-end sm:gap-3">
          <div className="min-w-0 flex-1">
            <label htmlFor="vacancy-search" className="text-sm font-medium">
              Search
            </label>
            <input
              id="vacancy-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Plot, ward, or address"
              className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="vacancy-type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="vacancy-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as (typeof vacancyTypes)[number])
              }
              className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              {vacancyTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-44">
            <label htmlFor="vacancy-lga" className="text-sm font-medium">
              LGA
            </label>
            <select
              id="vacancy-lga"
              value={lga}
              onChange={(event) =>
                setLga(event.target.value as (typeof vacancyLgas)[number])
              }
              className="mt-2 h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              {vacancyLgas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="text-sm text-ink-muted">
            {rows.length} {rows.length === 1 ? "vacancy" : "vacancies"}
          </p>
          <Link
            href="/application"
            className="text-sm text-forest hover:text-copper"
          >
            How to apply
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="mt-4 border border-line bg-paper-raised px-4 py-8 text-sm text-ink-muted">
            No vacancy matches that search. Clear the filters or try another
            LGA.
          </p>
        ) : (
          <ul className="mt-4 border border-line bg-paper-raised">
            {rows.map((item) => (
              <li
                key={item.id}
                className="grid gap-4 border-b border-line px-4 py-5 last:border-b-0 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
                      {item.id}
                    </p>
                    <Status value={item.status} />
                  </div>
                  <h2 className="mt-2 font-display text-2xl tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                    {item.summary}
                  </p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div>
                      <dt className="sr-only">Location</dt>
                      <dd>
                        {item.lga}, {item.state} · {item.ward}
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Type</dt>
                      <dd className="text-ink-muted">
                        {item.type} · {item.beds}
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Rent</dt>
                      <dd className="text-ink-muted">{item.rent}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Available</dt>
                      <dd className="text-ink-muted">
                        Available {item.available}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <Link
                    href="/application"
                    className="inline-flex h-11 items-center justify-center bg-forest px-4 text-sm text-paper-raised hover:bg-forest-deep"
                  >
                    Express interest
                  </Link>
                  <Link
                    href="/login/tenant"
                    className="inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink hover:bg-paper"
                  >
                    Sign in to apply
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
