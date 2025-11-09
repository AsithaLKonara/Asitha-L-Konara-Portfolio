"use client";

import { motion } from "framer-motion";

import { CallToAction } from "@/components/call-to-action";
import { ProjectCard, type ProjectCardProject } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";

interface ProjectsClientProps {
  projects: ProjectCardProject[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16">
      <div className="mx-auto max-w-6xl px-6 text-slate-200">
        <SectionHeading
          eyebrow="Case studies"
          title="Automation platforms and agents in production"
          description="Automation marketplaces, agents, and lead systems delivered end-to-end—designed to scale with observability, governance, and durable revenue loops."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} href={`/projects/${project.slug}`} showMetrics={true} />
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <CallToAction
            title="Want outcomes like these for your roadmap?"
            description="Tell me about the problem space and I’ll map how we can deliver impact that hiring managers can measure."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/resume.pdf", label: "Download résumé" }}
          />
        </div>
      </div>
    </div>
  );
}
