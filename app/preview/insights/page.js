import InsightsPreview from "@/app/preview/insights/InsightsPreview";

// A preview of the reworked Insights screen, with fixed numbers and no
// database behind it. The real tab at /?tab=insights is untouched.
export const metadata = { title: "Insights - preview" };

export default function InsightsPreviewPage() {
  return <InsightsPreview />;
}
