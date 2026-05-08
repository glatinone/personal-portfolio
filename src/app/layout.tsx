import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kiell Tampubolon — Cybersecurity Engineer",
  description:
    "Offensive security engineer based in Indonesia. Red teaming, malware analysis, and open-source security tooling.",
  openGraph: {
    title: "Kiell Tampubolon",
    description: "Cybersecurity Engineer — Offensive Security & Red Teaming",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scheme="light" suppressHydrationWarning>
      <head>
        {/* Prevent flash-of-wrong-theme by reading localStorage before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){const k="StackColorScheme";if(!localStorage.getItem(k))localStorage.setItem(k,"auto");const s=localStorage.getItem(k),d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.scheme=(s==="dark"||(s==="auto"&&d))?"dark":"light";})();`,
          }}
        />
      </head>
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter), var(--base-font-family)" }}>
        <div className="main-container">
          <aside className="left-sidebar">
            <Sidebar />
          </aside>
          <main className="main">{children}</main>
          <aside className="right-sidebar">
            <RightSidebar />
          </aside>
        </div>
      </body>
    </html>
  );
}
