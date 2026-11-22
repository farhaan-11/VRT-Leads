import PreviewApp from "@/app/preview/PreviewApp";

// A UI preview, not the real dashboard. It carries its own demo rows, so it
// never waits on the database and never goes blank while it is being judged.
//
// It covers the whole window on purpose: the point being tested is a screen
// that fits a laptop with no page scrolling.
export const metadata = { title: "VRT Leads - UI preview" };

export default function PreviewPage() {
  return <PreviewApp />;
}
