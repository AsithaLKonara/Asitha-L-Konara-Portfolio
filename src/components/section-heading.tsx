interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-3 ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
      {description ? (
        <p className="text-sm text-slate-400 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
