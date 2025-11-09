import Image from "next/image";

export interface ServiceCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: string | null;
  bullets: string[];
  iconImage?: string | null;
}

interface ServiceCardProps {
  service: ServiceCardData;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-[0_0_16px_rgba(56,189,248,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          {service.iconImage ? (
            <Image
              src={service.iconImage}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 flex-shrink-0 rounded-lg border border-white/10 object-cover"
              unoptimized={service.iconImage.startsWith("data:")}
            />
          ) : null}
          <div>
            <h3 className="text-2xl font-semibold text-white">{service.name}</h3>
            <p className="mt-3 text-sm text-slate-300">{service.description}</p>
          </div>
        </div>
        {service.price ? (
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            {service.price}
          </span>
        ) : null}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-300">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 text-cyan-300">▹</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
