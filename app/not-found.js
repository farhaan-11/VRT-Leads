import Link from "next/link";

// Any URL that is not a real route lands here. Next's own 404 does not match
// the rest of the dashboard, and a reviewer who mistypes a link should still
// see a page that reads like ours and knows where to go next.
export default function NotFound() {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border border-[#E6E8EC] bg-white p-8 text-center shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#667085]">
          404
        </p>

        <h1 className="mt-2 text-[18px] font-semibold text-[#0C111D]">
          Page not found
        </h1>

        <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
          The page you are looking for does not exist, or has moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[#3538CD] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
