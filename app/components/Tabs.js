"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { NavLink } from "@/app/components/Nav";

const TABS = [
  { id: "leads", label: "Leads", href: "/" },
  { id: "insights", label: "Insights", href: "/?tab=insights" },
];

// Two screens, one bar. The list is the work and the charts are the picture,
// so they sit side by side rather than stacked down one long page.
export default function Tabs() {
  const pathname = usePathname();
  const chosen = useSearchParams().get("tab") === "insights" ? "insights" : "leads";

  // The tabs belong to the dashboard. On the public form they would point a
  // visitor away from the page they are filling in.
  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="flex rounded-lg bg-[#1D2432] p-0.5">
      {TABS.map((tab) => (
        <NavLink
          key={tab.id}
          href={tab.href}
          className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition ${
            tab.id === chosen ? "bg-white text-[#0C111D]" : "text-[#98A2B3] hover:text-white"
          }`}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
