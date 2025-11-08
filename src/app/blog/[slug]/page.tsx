import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { articleDetails, getArticleDetail } from "@/lib/content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articleDetails.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleDetail(slug);

  if (!article) {
    return {
      title: "Article not found",
    } satisfies Metadata;
  }

  return {
    title: `${article.title} · Asitha L Konara`,
    description: article.excerpt,
  } satisfies Metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleDetail(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16 text-slate-200">
      <article className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to tech insights
        </Link>

        <header className="mt-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {article.readingTime}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">{article.title}</h1>
          <p className="mt-4 text-slate-300">{article.excerpt}</p>
        </header>

        <div className="prose prose-invert mt-8 max-w-none text-slate-200">
          {article.content.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <p>
            Hiring or scoping a build? Let&apos;s talk about how these lessons can accelerate your automation roadmap.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition hover:-translate-y-1"
            >
              Book a call
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-white/20 px-5 py-2 text-sm text-slate-200 transition hover:border-white/40 hover:bg-white/10"
            >
              View highlights
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
