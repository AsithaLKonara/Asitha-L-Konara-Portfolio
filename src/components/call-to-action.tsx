import Link from "next/link";

interface CallToActionProps {
  title: string;
  description: string;
  primary: {
    href: string;
    label: string;
  };
  secondary?: {
    href: string;
    label: string;
  };
}

export function CallToAction({ title, description, primary, secondary }: CallToActionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-600/10 via-slate-900/40 to-indigo-600/10 p-8 shadow-[0_0_30px_rgba(56,189,248,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_55%)] opacity-60" />
      <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link
            href={primary.href}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(56,189,248,0.45)] transition hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]"
          >
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="rounded-lg border border-white/20 px-5 py-3 text-sm text-slate-200 transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
