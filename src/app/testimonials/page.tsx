import { CallToAction } from "@/components/call-to-action";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { getTestimonials } from "@/lib/data";

export const metadata = {
  title: "What People Say · Asitha L Konara",
  description:
    "Testimonials from founders, product leads, and collaborators about shipping AI automation platforms and developer tooling together.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people say"
          description="Short notes from partners and collaborators on the impact of automation platforms, AI agents, and developer tooling we shipped."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-16">
          <CallToAction
            title="Let&apos;s create the next success story"
            description="Reach out and I&apos;ll outline how we can tackle your automation or AI roadmap together."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/projects", label: "View case studies" }}
          />
        </div>
      </div>
    </div>
  );
}
