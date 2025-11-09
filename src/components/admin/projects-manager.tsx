"use client";

import type { Project } from "@/generated/prisma/client";
import { FormEvent, useMemo, useState } from "react";

import { asStringArray, parseMultilineList } from "./utils";
import { ImageField } from "./image-field";

type ProjectFormPayload = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  contribution: string;
  impact: string;
  overview?: string;
  challenges: string[];
  solution: string[];
  outcomes: string[];
  stack: string[];
  tech: string[];
  featured: boolean;
  heroImage?: string;
};

type ProjectState = Project & {
  challenges: string[];
  solution: string[];
  outcomes: string[];
  stack: string[];
  tech: string[];
  heroImage: string | null;
};

function toProjectState(project: Project): ProjectState {
  return {
    ...project,
    challenges: asStringArray(project.challenges),
    solution: asStringArray(project.solution),
    outcomes: asStringArray(project.outcomes),
    stack: asStringArray(project.stack),
    tech: asStringArray(project.tech),
    heroImage: project.heroImage ?? null,
  };
}

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<ProjectState[]>(
    () => initialProjects.map(toProjectState)
  );
  const [filter, setFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to create project");
      }

      const data = await response.json();
      setProjects((prev) => [...prev, toProjectState(data.project)]);
      setMessage("Project created");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to update project");
      }

      const data = await response.json();
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? toProjectState(data.project) : project))
      );
      setMessage("Project updated");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update project");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to delete project");
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      setMessage("Project deleted");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to delete project");
    }
  }

  const orderedProjects = useMemo(
    () =>
      [...projects]
        .filter((project) =>
          filter
            ? project.title.toLowerCase().includes(filter.toLowerCase()) ||
              project.slug.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [projects, filter]
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Add project</h2>
        <ProjectForm onSubmit={handleCreate} isSubmitting={isSubmitting} key="create" />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Existing projects</h2>
        <input
          type="search"
          placeholder="Filter projects by title or slug"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
        />
        <div className="space-y-6">
          {orderedProjects.map((project) => (
            <ProjectForm
              key={project.id}
              project={project}
              onSubmit={(formData) => handleUpdate(project.id, formData)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

function ProjectForm({
  onSubmit,
  project,
  isSubmitting,
  onDelete,
}: {
  onSubmit: (formData: FormData) => Promise<void> | void;
  project?: ProjectState;
  isSubmitting?: boolean;
  onDelete?: () => Promise<void> | void;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await onSubmit(formData);
    if (!project) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField name="slug" label="Slug" defaultValue={project?.slug} required />
        <InputField name="title" label="Title" defaultValue={project?.title} required />
        <InputField name="tagline" label="Tagline" defaultValue={project?.tagline} required />
        <InputField name="impact" label="Impact" defaultValue={project?.impact} required />
      </div>
      <TextAreaField name="summary" label="Summary" defaultValue={project?.summary} required />
      <TextAreaField name="problem" label="Problem" defaultValue={project?.problem} required />
      <TextAreaField name="contribution" label="Contribution" defaultValue={project?.contribution} required />
      <TextAreaField name="overview" label="Overview" defaultValue={project?.overview ?? ""} />
      <ImageField
        key={`hero-${project?.id ?? "new"}-${project?.heroImage ?? "none"}`}
        name="heroImage"
        label="Hero image"
        initialValue={project?.heroImage ?? ""}
        helperText="Upload a JPEG/PNG or paste a data URL. Recommended size 1200x600."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextAreaField
          name="challenges"
          label="Challenges (one per line)"
          defaultValue={project?.challenges.join("\n") ?? ""}
        />
        <TextAreaField
          name="solution"
          label="Solution (one per line)"
          defaultValue={project?.solution.join("\n") ?? ""}
        />
        <TextAreaField
          name="outcomes"
          label="Outcomes (one per line)"
          defaultValue={project?.outcomes.join("\n") ?? ""}
        />
        <TextAreaField
          name="stack"
          label="Stack (one per line)"
          defaultValue={project?.stack.join("\n") ?? ""}
        />
        <TextAreaField
          name="tech"
          label="Tech tags (one per line)"
          defaultValue={project?.tech.join("\n") ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4"
        />
        Featured on homepage
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && !project ? "Creating…" : project ? "Save changes" : "Create project"}
        </button>
        {project && onDelete ? (
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
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
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
        rows={4}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
      />
    </div>
  );
}

function formDataToPayload(formData: FormData): ProjectFormPayload {
  return {
    slug: formData.get("slug")?.toString().trim() ?? "",
    title: formData.get("title")?.toString().trim() ?? "",
    tagline: formData.get("tagline")?.toString().trim() ?? "",
    summary: formData.get("summary")?.toString().trim() ?? "",
    problem: formData.get("problem")?.toString().trim() ?? "",
    contribution: formData.get("contribution")?.toString().trim() ?? "",
    impact: formData.get("impact")?.toString().trim() ?? "",
    overview: formData.get("overview")?.toString().trim() || undefined,
    challenges: parseMultilineList(formData.get("challenges")),
    solution: parseMultilineList(formData.get("solution")),
    outcomes: parseMultilineList(formData.get("outcomes")),
    stack: parseMultilineList(formData.get("stack")),
    tech: parseMultilineList(formData.get("tech")),
    featured: formData.get("featured") === "on",
    heroImage: formData.get("heroImage")?.toString().trim() || undefined,
  };
}
