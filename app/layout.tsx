import type { Metadata } from "next";
import { Geist, Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const marathiSans = Noto_Sans_Devanagari({
  variable: "--font-marathi-sans",
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  title: "Batch Reunion 2026",
  description: "Reunion website for Diganchi High School Batch 2008",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${marathiSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top,#fff5d8,transparent_40%),linear-gradient(180deg,#fffdf7_0%,#fffaf0_45%,#fffdf8_100%)] text-slate-900">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_60%)]" />
          <div className="pointer-events-none absolute -left-24 top-56 h-72 w-72 rounded-full bg-amber-100/45 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-[28rem] h-80 w-80 rounded-full bg-rose-100/35 blur-3xl" />
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
