import Image from "next/image";
import Link from "next/link";

import { getLatestVercelDeployment } from "@/lib/integrations/vercel";

const STATUS_STYLES: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  READY: {
    label: "Ready",
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  BUILDING: {
    label: "Building",
    badge: "bg-cyan-500/10 text-cyan-200 border border-cyan-400/30",
    dot: "bg-cyan-300",
  },
  QUEUED: {
    label: "Queued",
    badge: "bg-amber-500/10 text-amber-200 border border-amber-400/30",
    dot: "bg-amber-300",
  },
  ERROR: {
    label: "Failed",
    badge: "bg-rose-500/10 text-rose-200 border border-rose-400/30",
    dot: "bg-rose-300",
  },
  CANCELED: {
    label: "Canceled",
    badge: "bg-slate-500/10 text-slate-300 border border-slate-400/30",
    dot: "bg-slate-300",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusStyles(state: string) {
  return STATUS_STYLES[state] ?? STATUS_STYLES.READY;
}

export async function VercelDeploymentCard() {
  const deployment = await getLatestVercelDeployment();

  if (!deployment) {
    return (
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Latest Vercel deployment</h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure Vercel credentials to surface deployment status inside your dashboard.
            </p>
          </div>
        </header>
        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-950/40 p-4 text-sm text-slate-300">
          <p>
            Add `VERCEL_ACCESS_TOKEN` and either `VERCEL_PROJECT_ID` or `VERCEL_PROJECT_NAME` (plus optional
            `VERCEL_TEAM_ID`) to your environment. Once set, the dashboard will show the most recent deployment.
          </p>
          <p className="text-xs text-slate-500">
            Tokens need the &quot;Deployments (read)&quot; scope. Generate one at{" "}
            <Link
              href="https://vercel.com/account/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200"
            >
              vercel.com/account/tokens
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  const status = getStatusStyles(deployment.state);
  const commitSha = deployment.git?.commitSha?.slice(0, 7);
  const repoUrl = deployment.git?.repoUrl;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Latest Vercel deployment</h2>
          <p className="mt-1 text-sm text-slate-400">Live snapshot of the production deployment.</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
        <Link
          href={deployment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/40"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 to-transparent opacity-0 transition group-hover:opacity-100" />
          <Image
            src={deployment.screenshotUrl ?? "/vercel.svg"}
            alt="Latest deployment preview"
            width={640}
            height={400}
            className="h-full w-full object-cover"
            priority={false}
            unoptimized
          />
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
            Visit deployment →
          </span>
        </Link>

        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
          <dl className="grid gap-3">
            <div className="grid gap-1">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Deployment URL</dt>
              <dd>
                <Link href={deployment.url} className="font-medium text-cyan-300 hover:text-cyan-200" target="_blank" rel="noopener noreferrer">
                  {deployment.url.replace(/^https?:\/\//, "")}
                </Link>
              </dd>
            </div>

            {deployment.domains.length > 0 ? (
              <div className="grid gap-1">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Domains</dt>
                <dd className="flex flex-wrap gap-2">
                  {deployment.domains.map((domain) => (
                    <span key={domain} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">
                      {domain}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}

            <div className="grid gap-1">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Created</dt>
              <dd>{formatDate(deployment.createdAt)}</dd>
            </div>

            {deployment.git?.commitMessage || commitSha ? (
              <div className="grid gap-1">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Commit</dt>
                <dd className="flex flex-col gap-1">
                  {deployment.git?.commitMessage ? (
                    <span className="font-medium text-slate-100">{deployment.git.commitMessage}</span>
                  ) : null}
                  {commitSha ? (
                    repoUrl ? (
                      <Link
                        href={`${repoUrl.replace(/\.git$/, "")}/commit/${deployment.git?.commitSha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-300 hover:text-cyan-200"
                      >
                        {commitSha}
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">{commitSha}</span>
                    )
                  ) : null}
                </dd>
              </div>
            ) : null}

            {deployment.creator?.name ? (
              <div className="grid gap-1">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Deployed by</dt>
                <dd className="flex items-center gap-2">
                  {deployment.creator?.avatar ? (
                    <Image
                      src={deployment.creator.avatar}
                      alt={`${deployment.creator.name} avatar`}
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full border border-white/10"
                    />
                  ) : null}
                  <span>{deployment.creator.name}</span>
                </dd>
              </div>
            ) : null}

            {deployment.inspectorUrl ? (
              <div className="grid gap-1">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Inspector</dt>
                <dd>
                  <Link
                    href={deployment.inspectorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    Open in Vercel →
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </section>
  );
}

