import Image from "next/image";

export interface TestimonialCardData {
  id: string;
  slug: string;
  name: string;
  role: string;
  quote: string;
  avatarImage?: string | null;
}

interface TestimonialCardProps {
  testimonial: TestimonialCardData;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <blockquote className="glass-card h-full rounded-2xl border border-white/10 p-6 text-sm text-slate-300 shadow-[0_0_18px_rgba(56,189,248,0.08)]">
      <div className="flex items-start gap-3">
        {testimonial.avatarImage ? (
          <Image
            src={testimonial.avatarImage}
            alt={testimonial.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-white/10 object-cover"
            unoptimized={testimonial.avatarImage.startsWith("data:")}
          />
        ) : null}
        <p className="text-base font-medium text-slate-100">“{testimonial.quote}”</p>
      </div>
      <footer className="mt-4 text-xs uppercase tracking-wide text-slate-400">
        {testimonial.name} · {testimonial.role}
      </footer>
    </blockquote>
  );
}
