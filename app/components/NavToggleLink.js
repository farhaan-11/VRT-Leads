"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// One button that swaps label and target based on which page the visitor is
// on. On the events page they need a way back to the dashboard; on the
// dashboard they need a way to the events page. One slot, two jobs — no extra
// button that is dark on the page it belongs to.
export default function NavToggleLink() {
  const pathname = usePathname();
  const onEvents = pathname === "/events";

  return (
    <Link
      href={onEvents ? "/" : "/events"}
      className="rounded-lg bg-[#3538CD] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
    >
      {onEvents ? "Dashboard" : "Events"}
    </Link>
  );
}
