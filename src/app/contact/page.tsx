import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Hire AI Engineer & Automation Developer · Asitha L Konara",
  description:
    "Reach out to collaborate on AI automation, workflow platforms, or developer tooling. Open to full-time and contract roles worldwide.",
};

export default function ContactPage() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          className="max-w-2xl"
          title="Let&apos;s build automation that compounds"
          description="Share your challenge or opportunity. I&apos;ll respond with an outline of how we can design, build, and launch a high-leverage automation system."
        />

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
          <section className="glass-card rounded-2xl border border-white/10 p-6 text-sm text-slate-300">
            <h2 className="text-xl font-semibold text-white">What to expect</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="font-medium text-cyan-300">48-hour response:</span> I&apos;ll reply with next steps and initial thoughts on scope.
              </li>
              <li>
                <span className="font-medium text-cyan-300">Discovery session:</span> We&apos;ll map automation opportunities, success metrics, and constraints.
              </li>
              <li>
                <span className="font-medium text-cyan-300">Roadmap:</span> You receive a concise architecture + execution plan to move forward.
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
              <p>
                I&apos;m currently open to Software Engineer / AI Developer roles—full-time (hybrid or remote) and high-impact contracts.
              </p>
              <p className="mt-3 grid gap-1 text-slate-300 md:grid-cols-2">
                <span>
                  Email:{" "}
                  <a className="text-cyan-300" href="mailto:hello@asithalkonara.com">
                    hello@asithalkonara.com
                  </a>
                </span>
                <span>
                  LinkedIn:{" "}
                  <a
                    className="text-cyan-300"
                    href="https://www.linkedin.com/in/asitha-konara"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /in/asitha-konara
                  </a>
                </span>
                <span>
                  GitHub:{" "}
                  <a
                    className="text-cyan-300"
                    href="https://github.com/asithalkonara"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @asithalkonara
                  </a>
                </span>
                <span>
                  Résumé:{" "}
                  <a className="text-cyan-300" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </a>
                </span>
              </p>
              <p className="mt-2">
                For consulting availability, note desired kickoff dates or deadlines in your message.
              </p>
            </div>
          </section>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
