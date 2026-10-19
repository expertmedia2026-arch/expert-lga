export type Vacancy = {
  id: string;
  title: string;
  lga: string;
  state: string;
  ward: string;
  type: string;
  beds: string;
  rent: string;
  available: string;
  status: "Open" | "Closing soon" | "Waitlist";
  summary: string;
};

export const vacancies: Vacancy[] = [
  {
    id: "VAC-2401",
    title: "Two-bedroom flat · Odenigbo Road",
    lga: "Nsukka",
    state: "Enugu",
    ward: "Ward 3",
    type: "Social housing",
    beds: "2 bed",
    rent: "₦120,000 / month",
    available: "1 Nov 2026",
    status: "Open",
    summary:
      "Ground-floor council flat with a small yard. Suitable for a family of four.",
  },
  {
    id: "VAC-2402",
    title: "Staff quarter · University Road",
    lga: "Nsukka",
    state: "Enugu",
    ward: "Ward 2",
    type: "Staff quarter",
    beds: "3 bed",
    rent: "₦85,000 / month",
    available: "15 Nov 2026",
    status: "Open",
    summary:
      "Reserved for verified local government and teaching hospital staff.",
  },
  {
    id: "VAC-2403",
    title: "Lock-up shop · Onuiyi Market",
    lga: "Nsukka",
    state: "Enugu",
    ward: "Ward 1",
    type: "Commercial",
    beds: "Shop",
    rent: "₦60,000 / month",
    available: "Now",
    status: "Closing soon",
    summary:
      "Front-facing lock-up with power meter in place. Expressions of interest close 28 October.",
  },
  {
    id: "VAC-2404",
    title: "Family bungalow · Isiakpu Street",
    lga: "Nsukka",
    state: "Enugu",
    ward: "Ward 4",
    type: "Social housing",
    beds: "3 bed",
    rent: "₦150,000 / month",
    available: "1 Dec 2026",
    status: "Open",
    summary:
      "Detached bungalow on a registered plot. Inspection visits by appointment.",
  },
  {
    id: "VAC-2405",
    title: "One-bedroom unit · New Layout",
    lga: "Enugu East",
    state: "Enugu",
    ward: "Ward 2",
    type: "Social housing",
    beds: "1 bed",
    rent: "₦95,000 / month",
    available: "Now",
    status: "Waitlist",
    summary:
      "Compact unit for a single applicant or couple. Waitlist opens after document check.",
  },
  {
    id: "VAC-2406",
    title: "Corner shop · Owerre Close",
    lga: "Nsukka",
    state: "Enugu",
    ward: "Ward 3",
    type: "Commercial",
    beds: "Shop",
    rent: "₦45,000 / month",
    available: "10 Nov 2026",
    status: "Open",
    summary: "Corner unit with street frontage. Prefer traders already registered in the LGA.",
  },
];

export const vacancyTypes = [
  "All types",
  "Social housing",
  "Staff quarter",
  "Commercial",
] as const;

export const vacancyLgas = [
  "All LGAs",
  ...Array.from(new Set(vacancies.map((item) => item.lga))).sort(),
] as const;
