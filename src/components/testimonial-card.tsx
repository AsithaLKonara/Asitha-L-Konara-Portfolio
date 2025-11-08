import type { Testimonial } from "@/lib/content";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <blockquote className="glass-card h-full rounded-2xl border border-white/10 p-6 text-sm text-slate-300 shadow-[0_0_18px_rgba(56,189,248,0.08)]">
      <p className="text-base font-medium text-slate-100">“{testimonial.quote}”</p>
      <footer className="mt-4 text-xs uppercase tracking-wide text-slate-400">
        {testimonial.name} · {testimonial.role}
      </footer>
    </blockquote>
  );
}
