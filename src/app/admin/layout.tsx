import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { prisma } from "@/lib/prisma";

const NAV_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const adminId = headersList.get("x-admin-id");

  const admin = adminId
    ? await prisma.adminUser.findUnique({
        where: { id: adminId },
        select: { email: true },
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/admin" className="text-lg font-semibold text-white">
              Admin Dashboard
            </Link>
            <p className="text-xs text-slate-400">Manage portfolio content and submissions</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            {admin ? <span>{admin.email}</span> : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row">
        <aside className="w-full shrink-0 space-y-2 rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:w-60">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 rounded-2xl border border-white/10 bg-slate-900/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
