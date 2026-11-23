import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/app/components/TopBar";
import { RouteProgress } from "@/app/components/Nav";

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

// The window is the frame. The bar keeps its height and whatever the page
// puts below it gets the rest, which is how the dashboard fits a laptop
// without the whole page scrolling.
//
// Each page decides whether its own middle scrolls, because the public form
// is taller than the screen on purpose and the dashboard is not.
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col overflow-hidden">
        <RouteProgress />
        <TopBar />
        {children}
      </body>
    </html>
  );
}
