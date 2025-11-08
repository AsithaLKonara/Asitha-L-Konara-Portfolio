"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/content";

const linkBaseClasses =
  "px-4 py-2 rounded-lg transition text-sm font-medium text-slate-300/80 hover:text-slate-100";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-100 transition hover:text-cyan-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 text-black font-semibold shadow-lg">
            AK
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Asitha L Konara
            </div>
            <div className="text-sm font-semibold text-white/90">
              AI Engineer & Founder
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBaseClasses} ${
                  isActive
                    ? "bg-white/15 text-white shadow-md"
                    : "hover:bg-white/10"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(56,189,248,0.35)] transition hover:-translate-y-1 hover:shadow-[0_0_22px_rgba(99,102,241,0.6)] md:inline-flex"
        >
          Hire Me
        </Link>
      </div>
    </header>
  );
}
