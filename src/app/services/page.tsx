import { CallToAction } from "@/components/call-to-action";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { getServices } from "@/lib/data";

export const metadata = {
  title: "AI Engineer & Automation Developer · What I Offer",
  description:
    "End-to-end product engineering: shipping AI automations, SaaS platforms, design-to-dev tooling, and developer experience systems.",
};

const processSteps = [
  {
    title: "Discovery & Strategy",
    description:
      "Embed quickly, audit the current systems, and surface automation or platform bets with measurable impact.",
  },
  {
    title: "Architecture & Build",
    description:
      "Design resilient architectures, choose the right orchestration, and ship in weekly increments with clear demos.",
  },
  {
    title: "Launch & Scale",
    description:
      "Instrument adoption, onboard teams, and create enablement artifacts so engineering and ops keep momentum.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Value"
          title="What I offer as a developer"
          description="Hands-on engineering partner who can own discovery, architecture, shipping, and iteration across AI, automation, and DX initiatives."
        />

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">How I plug into teams</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.title} className="rounded-xl border border-white/10 bg-slate-900/40 p-5 shadow-[0_0_12px_rgba(56,189,248,0.05)]">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16">
          <CallToAction
            title="Ready to add an engineer who ships?"
            description="Message me with the roadmap you need help delivering—I'll respond with how I’d accelerate it within 48 hours."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/resume.pdf", label: "Download résumé" }}
          />
        </div>
      </div>
    </div>
  );
}
