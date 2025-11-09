import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getArticles } from "@/lib/data";

export const metadata = {
  title: "Tech Insights · Asitha L Konara",
  description:
    "Automation, AI agent operations, and developer tooling articles from Asitha L Konara—hands-on lessons from shipping production systems.",
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Tech Insights"
          title="Lessons from shipping automation"
          description="Playbooks and postmortems on launching automation-first products—from marketplaces and AI agents to design-to-dev pipelines."
        />

        <div className="mt-12 grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              {article.coverImage ? (
                <div className="-mt-6 mb-4 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={article.coverImage}
                    alt={`${article.title} cover`}
                    width={1200}
                    height={480}
                    className="h-48 w-full object-cover"
                    unoptimized={article.coverImage.startsWith("data:")}
                  />
                </div>
              ) : null}
              <div className="text-xs uppercase tracking-wide text-cyan-300">
                {article.publishedAt.toLocaleDateString(undefined, {
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
