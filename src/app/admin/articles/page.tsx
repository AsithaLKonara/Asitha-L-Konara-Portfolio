import { ArticlesManager } from "@/components/admin/articles-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Articles</h1>
        <p className="mt-1 text-sm text-slate-400">
          Draft, update, and publish long-form content that appears on the blog.
        </p>
      </div>

      <ArticlesManager initialArticles={articles} />
    </div>
  );
}
