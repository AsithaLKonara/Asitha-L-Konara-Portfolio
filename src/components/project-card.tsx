import Image from "next/image";
import Link from "next/link";

export interface ProjectCardProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  contribution: string;
  impact: string;
  tech: string[];
  heroImage?: string | null;
}

interface ProjectCardProps {
  project: ProjectCardProject;
  href?: string;
  showMetrics?: boolean;
  className?: string;
}

export function ProjectCard({ project, href, showMetrics = true, className = "" }: ProjectCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={`group block rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 shadow-[0_0_12px_rgba(56,189,248,0.05)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_18px_rgba(56,189,248,0.12)] ${className}`.trim()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{project.tagline}</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-xl text-slate-200 transition group-hover:bg-white/20">
            →
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-cyan-200"
            >
              {item}
            </span>
          ))}
        </div>
        {project.heroImage ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={project.heroImage}
              alt={`${project.title} preview`}
              width={1200}
              height={480}
              className="h-48 w-full object-cover"
              unoptimized={project.heroImage.startsWith("data:")}
            />
          </div>
        ) : null}
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>
            <span className="font-semibold text-slate-100">Problem:</span> {project.problem}
          </p>
          <p>
            <span className="font-semibold text-slate-100">Contribution:</span> {project.contribution}
          </p>
          {showMetrics ? (
            <p className="text-emerald-300">
              <span className="font-semibold uppercase tracking-wide text-emerald-200">Impact:</span>{" "}
              {project.impact}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 shadow-[0_0_12px_rgba(56,189,248,0.05)] ${className}`.trim()}
    >
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-1 text-sm text-slate-400">{project.tagline}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-cyan-200"
          >
            {item}
          </span>
        ))}
      </div>
      {project.heroImage ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <Image
            src={project.heroImage}
            alt={`${project.title} preview`}
            width={1200}
            height={480}
            className="h-48 w-full object-cover"
            unoptimized={project.heroImage.startsWith("data:")}
          />
        </div>
      ) : null}
      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-slate-100">Problem:</span> {project.problem}
        </p>
        <p>
          <span className="font-semibold text-slate-100">Contribution:</span> {project.contribution}
        </p>
        {showMetrics ? (
          <p className="text-emerald-300">
            <span className="font-semibold uppercase tracking-wide text-emerald-200">Impact:</span>{" "}
            {project.impact}
          </p>
        ) : null}
      </div>
    </div>
  );
}
