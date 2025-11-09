import { ProjectsManager } from "@/components/admin/projects-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage highlighted case studies, update details, and control featured placements.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
