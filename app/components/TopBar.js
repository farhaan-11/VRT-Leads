import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser, getAllViewers } from "@/lib/currentUser";
import { Avatar } from "@/app/components/ui";
import Tabs from "@/app/components/Tabs";
import ViewAsSelect from "@/app/components/ViewAsSelect";

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3538CD] text-[11px] font-bold text-white">
        VR
      </span>
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-white">VRT Leads</p>
        <p className="text-[11px] text-[#98A2B3]">VEGA programme</p>
      </div>
    </div>
  );
}

// The bar sits in the layout, so every page gets it without asking.
//
// Tabs read the address bar, which only the browser can do. Suspense around
// it keeps that from holding up the rest of the bar.
export default async function TopBar() {
  const viewer = await getCurrentUser();
  const viewers = await getAllViewers();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 bg-[#0C111D] px-4">
      <div className="flex items-center gap-6">
        <Brand />
        <Suspense fallback={null}>
          <Tabs />
        </Suspense>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/enquiries/new"
          className="rounded-lg bg-[#3538CD] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
        >
          New enquiry
        </Link>

        <div className="flex items-center gap-2">
          <Avatar name={viewer.name} />
          <ViewAsSelect viewer={viewer} viewers={viewers} />
        </div>
      </div>
    </header>
  );
}
