import Link from "next/link";
import EnquiryForm from "@/app/components/EnquiryForm";

// The layout above this page reads a cookie, so nothing here is built ahead
// of time anyway. This line says so out loud, because a page that is built
// at deploy time cannot reach the database and fails the whole build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "New enquiry - VRT Leads",
  description: "Tell VRT about your business and someone will be in touch",
};

export default function NewEnquiryPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 overflow-y-auto p-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          Back to dashboard
        </Link>

        <h1 className="mt-2 text-2xl font-semibold">Tell us about your business</h1>
        <p className="mt-1 text-sm text-slate-600">
          Fill this in and someone from VRT will be in touch. Fields marked *
          are needed.
        </p>
      </div>

      <EnquiryForm />
    </main>
  );
}
