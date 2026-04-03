"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/rsvp", label: "Registration" },
  { href: "/people", label: "Friends List" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <nav className="flex items-center justify-between rounded-full border border-white/70 bg-white/85 px-5 py-4 shadow-lg shadow-amber-100/50 backdrop-blur xl:px-7">
          <Link
            href="/"
            className="max-w-[220px] text-base font-semibold leading-snug tracking-tight text-slate-900 sm:max-w-none sm:text-2xl"
          >
            <span className="sm:hidden">
              इयत्ता १० वी - बॅच २००८
              <span className="block">Get Together</span>
            </span>
            <span className="hidden sm:inline">इयत्ता १० वी - बॅच २००८ Get Together</span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full bg-slate-50/90 p-1.5 text-sm font-medium text-slate-600 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2.5 transition ${
                  pathname === link.href
                    ? "bg-sky-200 text-sky-950 shadow-sm"
                    : "hover:bg-white hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="mt-3 rounded-[1.75rem] border border-white/80 bg-white/95 p-3 shadow-lg shadow-amber-100/50 backdrop-blur md:hidden">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                    pathname === link.href
                      ? "bg-sky-200 text-sky-950"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
