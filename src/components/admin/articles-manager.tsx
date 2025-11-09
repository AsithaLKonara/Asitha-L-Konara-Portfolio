"use client";

import type { Article } from "@/generated/prisma/client";
import { FormEvent, useMemo, useState } from "react";

import { formatDateInput } from "./utils";
import { ImageField } from "./image-field";
import { RichTextEditor } from "./rich-text-editor";

type ArticleState = Article;

type ArticlePayload = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
};

export function ArticlesManager({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<ArticleState[]>(() => initialArticles);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to create article");
      }

      const data = await response.json();
      setArticles((prev) => [...prev, data.article]);
      setMessage("Article created");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to create article");
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to update article");
      }

      const data = await response.json();
      setArticles((prev) => prev.map((article) => (article.id === id ? data.article : article)));
      setMessage("Article updated");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update article");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to delete article");
      }

      setArticles((prev) => prev.filter((article) => article.id !== id));
      setMessage("Article deleted");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to delete article");
    }
  }

  const orderedArticles = useMemo(() => {
    const normalizedFilter = filter.toLowerCase();
    return [...articles]
      .filter((article) =>
        normalizedFilter
          ? article.title.toLowerCase().includes(normalizedFilter) ||
            article.slug.toLowerCase().includes(normalizedFilter)
          : true,
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles, filter]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Publish article</h2>
        <ArticleForm onSubmit={handleCreate} key="create" />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Articles</h2>
        <input
          type="search"
          placeholder="Filter articles by title or slug"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
        />
        <div className="space-y-6">
          {orderedArticles.map((article) => (
            <ArticleForm
              key={article.id}
              article={article}
              onSubmit={(formData) => handleUpdate(article.id, formData)}
              onDelete={() => handleDelete(article.id)}
            />
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

function ArticleForm({
  article,
  onSubmit,
  onDelete,
}: {
  article?: ArticleState;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}) {
  const [contentHtml, setContentHtml] = useState(article?.contentHtml ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("contentHtml", contentHtml);
    await onSubmit(formData);
    if (!article) {
      form.reset();
      setContentHtml("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField name="slug" label="Slug" defaultValue={article?.slug} required />
        <InputField name="title" label="Title" defaultValue={article?.title} required />
      </div>
      <TextAreaField
        name="excerpt"
        label="Excerpt"
        defaultValue={article?.excerpt}
        required
        rows={3}
      />
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-slate-400">Body</label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          name="publishedAt"
          label="Published date"
          type="date"
          defaultValue={formatDateInput(article?.publishedAt)}
          required
        />
        <InputField
          name="readingTime"
          label="Reading time"
          defaultValue={article?.readingTime}
          required
        />
      </div>
      <ImageField
        key={`cover-${article?.id ?? "new"}-${article?.coverImage ?? "none"}`}
        name="coverImage"
        label="Cover image"
        initialValue={article?.coverImage ?? ""}
        helperText="Optional hero image displayed on the blog listing and article page."
      />
      <input type="hidden" name="contentHtml" value={contentHtml} />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {article ? "Save changes" : "Publish article"}
        </button>
        {article && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-rose-300 transition hover:border-rose-400 hover:text-rose-200"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function InputField({
  name,
  label,
  defaultValue,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
      />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  required,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
      />
    </div>
  );
}

function formDataToPayload(formData: FormData): ArticlePayload {
  return {
    slug: formData.get("slug")?.toString().trim() ?? "",
    title: formData.get("title")?.toString().trim() ?? "",
    excerpt: formData.get("excerpt")?.toString().trim() ?? "",
    contentHtml: formData.get("contentHtml")?.toString() ?? "",
    publishedAt: formData.get("publishedAt")?.toString().trim() ?? new Date().toISOString().slice(0, 10),
    readingTime: formData.get("readingTime")?.toString().trim() ?? "",
    coverImage: formData.get("coverImage")?.toString().trim() || undefined,
  };
}
