import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUser, getAllViewers } from "@/lib/currentUser";
import { switchViewer } from "@/app/actions/viewerActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VRT Leads Dashboard",
  description: "VEGA enquiries, leads and enrollments in one place",
};

// The four demo users, with the current one already chosen.
//
// The key remounts the select every time the viewer changes. A select keeps
// whatever the browser last showed, so without this the dropdown would say
// one name while the numbers below it belonged to another.
function ViewerSelect({ viewer, viewers }) {
  return (
    <select
      key={viewer.id}
      id="viewerId"
      name="viewerId"
      defaultValue={viewer.id}
      className="rounded border border-slate-300 px-2 py-1 text-sm"
    >
      {viewers.map((one) => (
        <option key={one.id} value={one.id}>
          {one.name} ({one.role})
        </option>
      ))}
    </select>
  );
}

// A plain form posting to a Server Action. A dropdown that submitted itself
// on change would need client JavaScript for one small convenience, and this
// page runs none at all.
function ViewAsForm({ viewer, viewers }) {
  return (
    <form action={switchViewer} className="flex items-center gap-2">
      <label htmlFor="viewerId" className="text-sm text-slate-600">
        View as
      </label>

      <ViewerSelect viewer={viewer} viewers={viewers} />

      <button
        type="submit"
        className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white"
      >
        Switch
      </button>
    </form>
  );
}

// The header lives in the layout, so every page gets it without asking.
function Header({ viewer, viewers }) {
  return (
    <header className="border-b border-slate-200 px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">VRT Leads</p>
          <p className="text-xs text-slate-500">Demo mode - no login</p>
        </div>

        <ViewAsForm viewer={viewer} viewers={viewers} />
      </div>
    </header>
  );
}

export default async function RootLayout({ children }) {
  const viewer = await getCurrentUser();
  const viewers = await getAllViewers();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header viewer={viewer} viewers={viewers} />
        {children}
      </body>
    </html>
  );
}
