"use client";

import type { ServiceOffering } from "@/generated/prisma/client";
import { FormEvent, useMemo, useState } from "react";

import { asStringArray, parseMultilineList } from "./utils";
import { ImageField } from "./image-field";

type ServicePayload = {
  slug: string;
  name: string;
  description: string;
  price?: string;
  bullets: string[];
  iconImage?: string;
};

export function ServicesManager({ initialServices }: { initialServices: ServiceOffering[] }) {
  const [services, setServices] = useState<ServiceOffering[]>(initialServices);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to create service");
      }

      const data = await response.json();
      setServices((prev) => [...prev, data.service]);
      setMessage("Service created");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to create service");
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    const payload = formDataToPayload(formData);

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to update service");
      }

      const data = await response.json();
      setServices((prev) => prev.map((service) => (service.id === id ? data.service : service)));
      setMessage("Service updated");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update service");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to delete service");
      }

      setServices((prev) => prev.filter((service) => service.id !== id));
      setMessage("Service deleted");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to delete service");
    }
  }

  const orderedServices = useMemo(
    () =>
      [...services]
        .filter((service) =>
          filter
            ? service.name.toLowerCase().includes(filter.toLowerCase()) ||
              service.slug.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [services, filter]
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Add service</h2>
        <ServiceForm key="create" onSubmit={handleCreate} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Services</h2>
        <input
          type="search"
          placeholder="Filter services by name or slug"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-white/30 focus:bg-white/10"
        />
        <div className="space-y-6">
          {orderedServices.map((service) => (
            <ServiceForm
              key={service.id}
              service={service}
              onSubmit={(formData) => handleUpdate(service.id, formData)}
              onDelete={() => handleDelete(service.id)}
            />
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

function ServiceForm({
  service,
  onSubmit,
  onDelete,
}: {
  service?: ServiceOffering;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await onSubmit(formData);
    if (!service) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField name="slug" label="Slug" defaultValue={service?.slug} required />
        <InputField name="name" label="Name" defaultValue={service?.name} required />
      </div>
      <TextAreaField
        name="description"
        label="Description"
        defaultValue={service?.description}
        required
        rows={3}
      />
      <InputField name="price" label="Price (optional)" defaultValue={service?.price ?? ""} />
      <TextAreaField
        name="bullets"
        label="Key points (one per line)"
        defaultValue={service ? asStringArray(service.bullets).join("\n") : ""}
      />
      <ImageField
        key={`icon-${service?.id ?? "new"}-${service?.iconImage ?? "none"}`}
        name="iconImage"
        label="Icon image"
        initialValue={service?.iconImage ?? ""}
        helperText="Small square image shown alongside the service."
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
        >
          {service ? "Save changes" : "Create service"}
        </button>
        {service && onDelete ? (
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

function formDataToPayload(formData: FormData): ServicePayload {
  return {
    slug: formData.get("slug")?.toString().trim() ?? "",
    name: formData.get("name")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",
    price: formData.get("price")?.toString().trim() || undefined,
    bullets: parseMultilineList(formData.get("bullets")),
    iconImage: formData.get("iconImage")?.toString().trim() || undefined,
  };
}
