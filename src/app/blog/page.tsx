import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { articles } from "@/lib/content";

export const metadata = {
  title: "Tech Insights · Asitha L Konara",
  description:
    "Automation, AI agent operations, and developer tooling articles from Asitha L Konara—hands-on lessons from shipping production systems.",
};

export default function BlogPage() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Tech Insights"
          title="Lessons from shipping automation"
          description="Playbooks and postmortems on launching AI agents, automation marketplaces, and developer experience pipelines."
        />

        <div className="mt-12 grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="text-xs uppercase tracking-wide text-cyan-300">
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white group-hover:text-cyan-200">
                {article.title}
              </h2>
              <p className="mt-3 text-sm text-slate-300">{article.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
                {article.readingTime} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
