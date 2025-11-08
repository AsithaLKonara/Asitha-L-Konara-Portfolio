import type { Metadata } from "next";
import Link from "next/link";

import { CallToAction } from "@/components/call-to-action";
import { notFound } from "next/navigation";

import { getProjectCaseStudy, projectCaseStudies } from "@/lib/content";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projectCaseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCaseStudy(slug);

  if (!project) {
    return {
      title: "Project not found",
    } satisfies Metadata;
  }

  return {
    title: `${project.title} · Case Study`,
    description: project.summary,
  } satisfies Metadata;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectCaseStudy(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/projects"
          className="text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to technical highlights
        </Link>

        <header className="mt-6">
          <p className="text-sm uppercase tracking-wide text-cyan-300">
            {project.tech.join(" · ")}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300">{project.overview}</p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Challenges
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {project.challenges.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Solution
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {project.solution.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Outcomes
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {project.outcomes.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-lg font-semibold text-white">Stack</h2>
          <p className="mt-3 text-sm text-slate-300">
            Tooling and platforms powering this project.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <CallToAction
            title="Need outcomes like this on your roadmap?"
            description="Share your product or platform goals and I’ll map the architecture, milestones, and rollout plan."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/resume.pdf", label: "Download résumé" }}
          />
        </div>
      </div>
    </div>
  );
}
