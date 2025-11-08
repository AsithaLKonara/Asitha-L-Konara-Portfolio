import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="text-slate-400">
          © {new Date().getFullYear()} Asitha L Konara · AI engineer & automation developer · Open to roles worldwide
        </p>
        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <Link className="transition hover:text-cyan-300" href="https://github.com/asithalkonara" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          <Link className="transition hover:text-cyan-300" href="https://www.linkedin.com/in/asitha-konara" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
          <a className="transition hover:text-cyan-300" href="mailto:hello@asithalkonara.com">
            hello@asithalkonara.com
          </a>
          <Link className="transition hover:text-cyan-300" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Résumé
          </Link>
        </div>
      </div>
    </footer>
  );
}
