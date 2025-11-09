import { ProjectsClient } from "@/components/projects/projects-client";
import { getProjects } from "@/lib/data";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <ProjectsClient
      projects={projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        tagline: project.tagline,
        summary: project.summary,
        problem: project.problem,
        contribution: project.contribution,
        impact: project.impact,
        tech: project.tech,
        heroImage: project.heroImage,
      }))}
    />
  );
}
