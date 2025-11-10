import "server-only";

interface GitMetadata {
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
  repoUrl?: string;
  authorName?: string;
  authorAvatar?: string;
}

export interface VercelDeploymentInfo {
  id: string;
  url: string;
  inspectorUrl: string | null;
  createdAt: Date;
  state: "READY" | "BUILDING" | "QUEUED" | "ERROR" | "CANCELED";
  target?: string;
  domains: string[];
  creator?: { name?: string; email?: string; avatar?: string };
  git?: GitMetadata;
  screenshotUrl?: string;
}

interface VercelDeploymentResponse {
  deployments: Array<{
    uid: string;
    id: string;
    url: string;
    state: VercelDeploymentInfo["state"];
    createdAt: number;
    target?: string;
    inspectorUrl?: string;
    meta?: Record<string, string | undefined>;
    domains?: { name: string }[];
    creator?: { name?: string; email?: string; avatar?: string };
    gitSource?: {
      ref?: string;
      remoteUrl?: string;
      commitSha?: string;
      author?: { name?: string; login?: string; avatar?: string };
      commitMessage?: string;
    };
  }>;
}

function getVercelConfig() {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const projectName = process.env.VERCEL_PROJECT_NAME;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) {
    console.warn("[vercel] Missing VERCEL_ACCESS_TOKEN env var");
    return null;
  }

  if (!projectId && !projectName) {
    console.warn("[vercel] Provide either VERCEL_PROJECT_ID or VERCEL_PROJECT_NAME env var");
    return null;
  }

  return { token, projectId, projectName, teamId };
}

export async function getLatestVercelDeployment(): Promise<VercelDeploymentInfo | null> {
  const config = getVercelConfig();
  if (!config) {
    return null;
  }

  const searchParams = new URLSearchParams({ limit: "1" });

  if (config.projectId) {
    searchParams.set("projectId", config.projectId);
  } else if (config.projectName) {
    searchParams.set("project", config.projectName);
  }

  if (config.teamId) {
    searchParams.set("teamId", config.teamId);
  }

  const endpoint = `https://api.vercel.com/v6/deployments?${searchParams.toString()}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[vercel] Failed to fetch deployments", response.status, await response.text());
      return null;
    }

    const data = (await response.json()) as VercelDeploymentResponse;
    const deployment = data.deployments?.[0];

    if (!deployment) {
      return null;
    }

    return {
      id: deployment.id,
      url: `https://${deployment.url}`,
      inspectorUrl: deployment.inspectorUrl ?? null,
      createdAt: new Date(deployment.createdAt),
      state: deployment.state,
      target: deployment.target,
      domains: deployment.domains?.map((domain) => domain.name) ?? [],
      creator: deployment.creator,
      git: {
        commitSha: deployment.gitSource?.commitSha ?? deployment.meta?.githubCommitSha ?? deployment.meta?.gitlabCommitSha,
        commitMessage: deployment.gitSource?.commitMessage ?? deployment.meta?.githubCommitMessage,
        branch: deployment.gitSource?.ref ?? deployment.meta?.githubBranch ?? deployment.meta?.gitlabBranch,
        repoUrl: deployment.gitSource?.remoteUrl ?? deployment.meta?.githubRepo ?? deployment.meta?.gitlabRepo,
        authorName: deployment.gitSource?.author?.name ?? deployment.meta?.githubCommitAuthorName,
        authorAvatar: deployment.gitSource?.author?.avatar ?? deployment.meta?.githubCommitAuthorAvatar,
      },
      screenshotUrl: `https://vercel.com/api/www/screenshot?deploymentId=${deployment.id}`,
    };
  } catch (error) {
    console.error("[vercel] Unexpected error", error);
    return null;
  }
}

