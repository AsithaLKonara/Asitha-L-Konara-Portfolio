"use client";

import type { Testimonial } from "@/generated/prisma/client";
import { FormEvent, useMemo, useState } from "react";

import { ImageField } from "./image-field";

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to create testimonial");
      }

      const data = await response.json();
      setTestimonials((prev) => [...prev, data.testimonial]);
      setMessage("Testimonial created");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to create testimonial");
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to update testimonial");
      }

      const data = await response.json();
      setTestimonials((prev) => prev.map((item) => (item.id === id ? data.testimonial : item)));
      setMessage("Testimonial updated");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update testimonial");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to delete testimonial");
      }

      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      setMessage("Testimonial deleted");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to delete testimonial");
    }
  }

  const orderedTestimonials = useMemo(
    () =>
      [...testimonials]
        .filter((testimonial) =>
          filter
            ? testimonial.name.toLowerCase().includes(filter.toLowerCase()) ||
              testimonial.slug.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [testimonials, filter]
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Add testimonial</h2>
        <TestimonialForm key="create" onSubmit={handleCreate} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Testimonials</h2>
        <input
          type="search"
          placeholder="Filter testimonials by name or slug"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
        />
        <div className="space-y-6">
          {orderedTestimonials.map((testimonial) => (
            <TestimonialForm
              key={testimonial.id}
              testimonial={testimonial}
              onSubmit={(formData) => handleUpdate(testimonial.id, formData)}
              onDelete={() => handleDelete(testimonial.id)}
            />
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

function TestimonialForm({
  testimonial,
  onSubmit,
  onDelete,
}: {
  testimonial?: Testimonial;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await onSubmit(formData);
    if (!testimonial) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField name="slug" label="Slug" defaultValue={testimonial?.slug} required />
        <InputField name="name" label="Name" defaultValue={testimonial?.name} required />
        <InputField name="role" label="Role" defaultValue={testimonial?.role} required />
      </div>
      <TextAreaField
        name="quote"
        label="Quote"
        defaultValue={testimonial?.quote}
        required
        rows={3}
      />
      <ImageField
        key={`avatar-${testimonial?.id ?? "new"}-${testimonial?.avatarImage ?? "none"}`}
        name="avatarImage"
        label="Avatar image"
        initialValue={testimonial?.avatarImage ?? ""}
        helperText="Optional portrait used in testimonials list."
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
        >
          {testimonial ? "Save changes" : "Create testimonial"}
        </button>
        {testimonial && onDelete ? (
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
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
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
        type="text"
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

function formDataToPayload(formData: FormData) {
  return {
    slug: formData.get("slug")?.toString().trim() ?? "",
    name: formData.get("name")?.toString().trim() ?? "",
    role: formData.get("role")?.toString().trim() ?? "",
    quote: formData.get("quote")?.toString().trim() ?? "",
    avatarImage: formData.get("avatarImage")?.toString().trim() || undefined,
  };
}
