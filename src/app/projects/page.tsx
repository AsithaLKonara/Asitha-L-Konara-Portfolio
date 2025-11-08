"use client";

import { motion } from "framer-motion";

import { CallToAction } from "@/components/call-to-action";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { projectSummaries } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)] py-16">
      <div className="mx-auto max-w-6xl px-6 text-slate-200">
        <SectionHeading
          eyebrow="Case studies"
          title="Technical highlights"
          description="Automation marketplaces, AI agents, lead systems, and developer tooling I led from concept to production—with measurable impact."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {projectSummaries.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard
                project={project}
                href={`/projects/${project.slug}`}
                showMetrics={true}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <CallToAction
            title="Want outcomes like these on your roadmap?"
            description="Tell me about the problem space and I’ll map how we can deliver impact that hiring managers can measure."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/resume.pdf", label: "Download résumé" }}
          />
        </div>
      </div>
    </div>
  );
}
