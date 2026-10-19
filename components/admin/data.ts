export type ApplicationStatus =
  | "Under review"
  | "Documents due"
  | "Ready for board"
  | "Allocated";

export type Application = {
  ref: string;
  name: string;
  ward: string;
  type: string;
  status: ApplicationStatus;
  updated: string;
};

export const applications: Application[] = [
  {
    ref: "LGA-2026-1842",
    name: "Ada Okonkwo",
    ward: "Ward 3",
    type: "Social housing",
    status: "Under review",
    updated: "13 Oct",
  },
  {
    ref: "LGA-2026-1790",
    name: "Ibrahim Sule",
    ward: "Ward 2",
    type: "Emergency",
    status: "Documents due",
    updated: "12 Oct",
  },
  {
    ref: "LGA-2026-1664",
    name: "Chioma Eze",
    ward: "Ward 1",
    type: "Staff quarter",
    status: "Ready for board",
    updated: "9 Oct",
  },
  {
    ref: "LGA-2026-1588",
    name: "Tunde Bakare",
    ward: "Ward 4",
    type: "Social housing",
    status: "Under review",
    updated: "8 Oct",
  },
  {
    ref: "LGA-2026-0911",
    name: "Musa Bello",
    ward: "Ward 3",
    type: "Social housing",
    status: "Allocated",
    updated: "4 Oct",
  },
];

export const properties = [
  {
    plot: "14B",
    ward: "Ward 3",
    use: "Staff quarter",
    status: "Occupied",
    holder: "Council tenancy",
    inspected: "4 Sep 2026",
  },
  {
    plot: "17",
    ward: "Ward 3",
    use: "Social housing",
    status: "Occupied",
    holder: "Ada Okonkwo",
    inspected: "18 Aug 2026",
  },
  {
    plot: "22",
    ward: "Ward 2",
    use: "Family bungalow",
    status: "Vacant",
    holder: "—",
    inspected: "2 Oct 2026",
  },
  {
    plot: "24",
    ward: "Ward 3",
    use: "Social housing",
    status: "Allocated",
    holder: "Musa Bello",
    inspected: "11 Sep 2026",
  },
  {
    plot: "25",
    ward: "Ward 1",
    use: "Social housing",
    status: "Under review",
    holder: "—",
    inspected: "29 Sep 2026",
  },
];

export const tenancies = [
  {
    tenant: "Ada Okonkwo",
    plot: "17 · Ward 3",
    rent: "Current",
    balance: "₦0",
  },
  {
    tenant: "Ibrahim Sule",
    plot: "8A · Ward 2",
    rent: "Arrears",
    balance: "₦86,000",
  },
  {
    tenant: "Chioma Eze",
    plot: "3 · Ward 1",
    rent: "Current",
    balance: "₦0",
  },
  {
    tenant: "Grace Nwosu",
    plot: "11 · Ward 4",
    rent: "Arrears",
    balance: "₦42,500",
  },
];

export const sittings = [
  {
    date: "21 Oct 2026",
    title: "Ward 2 and Ward 3 social housing",
    cases: "14 cases",
    note: "Sitting list publishes 48 hours ahead.",
  },
  {
    date: "28 Oct 2026",
    title: "Staff quarters",
    cases: "6 cases",
    note: "Includes plot 14B regularisation.",
  },
  {
    date: "4 Nov 2026",
    title: "Emergency housing review",
    cases: "3 cases",
    note: "Ward 2 emergency file is first on the list.",
  },
];

export const inspections = [
  {
    plot: "14B · Ward 3",
    officer: "Amina Yusuf",
    date: "4 Sep 2026",
    result: "Fit for occupation",
  },
  {
    plot: "22 · Ward 2",
    officer: "Kunle Adeyemi",
    date: "2 Oct 2026",
    result: "Vacant and ready",
  },
  {
    plot: "25 · Ward 1",
    officer: "Amina Yusuf",
    date: "29 Sep 2026",
    result: "Repairs outstanding",
  },
  {
    plot: "8A · Ward 2",
    officer: "Kunle Adeyemi",
    date: "16 Oct 2026",
    result: "Scheduled",
  },
];

export const notices = [
  {
    date: "13 Oct 2026",
    title: "Allocation board sits 21 October",
    copy: "Ward 2 and Ward 3 social housing. The sitting list is published 48 hours in advance.",
  },
  {
    date: "9 Oct 2026",
    title: "Rent window for council tenancies",
    copy: "October rents close on the 25th. Pay at the housing desk or through the tenancy account.",
  },
  {
    date: "2 Oct 2026",
    title: "Permit amnesty for unregistered extensions",
    copy: "Households may regularise existing works without a penalty until 30 November.",
  },
];

export const lgas = [
  {
    name: "Ikeja",
    state: "Lagos",
    chairman: "Amina Yusuf",
    status: "Active",
  },
  {
    name: "Surulere",
    state: "Lagos",
    chairman: "Kunle Adeyemi",
    status: "Active",
  },
  {
    name: "Enugu North",
    state: "Enugu",
    chairman: "Ada Okonkwo",
    status: "Active",
  },
  {
    name: "Kano Municipal",
    state: "Kano",
    chairman: "Ibrahim Sule",
    status: "Active",
  },
  {
    name: "Abuja Municipal",
    state: "FCT",
    chairman: "Musa Bello",
    status: "Onboarding",
  },
];

export const stats = [
  { value: "48", label: "Applications awaiting review" },
  { value: "12,480", label: "Properties on the register" },
  { value: "126", label: "Tenancies in arrears" },
  { value: "17", label: "Inspections this week" },
];
