export const owner = {
  name: "Musa Bello",
  role: "Property owner",
  lga: "Nsukka, Enugu",
  code: "LGA-JD8L2G",
  date: "Tuesday 13 October 2026",
};

export const stats = [
  { value: "4", label: "Properties on the register" },
  { value: "2", label: "Let to tenants" },
  { value: "1", label: "Vacant" },
  { value: "1", label: "Record with the desk" },
];

export const properties = [
  {
    plot: "24",
    address: "14 Odenigbo Road",
    use: "Four-bedroom house",
    status: "Occupied",
    occupant: "Adaeze Nwosu",
    title: "Registered",
  },
  {
    plot: "7",
    address: "3 Onuiyi Lane",
    use: "Lock-up shops",
    status: "Occupied",
    occupant: "Chinedu Okafor",
    title: "Registered",
  },
  {
    plot: "12",
    address: "9 Isiakpu Street",
    use: "Bungalow",
    status: "Vacant",
    occupant: "—",
    title: "Update pending",
  },
  {
    plot: "3",
    address: "21 Owerre Close",
    use: "Family compound",
    status: "Owner occupied",
    occupant: "Musa Bello",
    title: "Registered",
  },
];

export const tenancies = [
  {
    tenant: "Adaeze Nwosu",
    plot: "24 · 14 Odenigbo Road",
    rent: "Current",
    balance: "₦0",
    since: "March 2024",
  },
  {
    tenant: "Chinedu Okafor",
    plot: "7 · 3 Onuiyi Lane",
    rent: "Arrears",
    balance: "₦120,000",
    since: "January 2025",
  },
];

export const records = [
  {
    plot: "12",
    request: "Change of use to mixed residential",
    status: "Under review",
    filed: "8 Oct 2026",
  },
  {
    plot: "7",
    request: "Correct the name on the title",
    status: "Documents due",
    filed: "2 Oct 2026",
  },
  {
    plot: "24",
    request: "File the new survey plan",
    status: "Accepted",
    filed: "19 Sep 2026",
  },
];

export const notices = [
  {
    date: "13 Oct 2026",
    title: "Ground rent for plot 7",
    copy: "Nsukka housing desk expects the October ground rent for 3 Onuiyi Lane by 25 October.",
  },
  {
    date: "9 Oct 2026",
    title: "Inspection of the vacant bungalow",
    copy: "An officer will visit 9 Isiakpu Street on 18 October. Someone should be on the plot from 10:00.",
  },
  {
    date: "2 Oct 2026",
    title: "Permit amnesty for unregistered extensions",
    copy: "Existing works on registered plots can be regularised without a penalty until 30 November.",
  },
];
