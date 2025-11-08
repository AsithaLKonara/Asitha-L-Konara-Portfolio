"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export type ContactFormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      company: formData.get("company")?.toString().trim() || undefined,
      subject: formData.get("subject")?.toString().trim() || undefined,
      message: formData.get("message")?.toString().trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError("Name, email, and message are required.");
      return;
    }

    try {
      setFormState("submitting");
      setError(null);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }

      setFormState("success");
      event.currentTarget.reset();
    } catch (err) {
      setFormState("error");
      setError(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/10 p-6">
      <div className="grid gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="name">
            Name
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="email">
            Email
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="company">
              Company
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
              id="company"
              name="company"
              type="text"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="subject">
              Subject
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
              id="subject"
              name="subject"
              type="text"
              placeholder="Project focus"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="message">
            Project details
          </label>
          <textarea
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
            id="message"
            name="message"
            rows={6}
            placeholder="Share your goals, constraints, and what success looks like."
            required
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      {formState === "success" && (
        <p className="mt-4 text-sm text-emerald-300">
          Thanks for reaching out! I&apos;ll reply within 48 hours.
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={formState === "submitting"}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formState === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
