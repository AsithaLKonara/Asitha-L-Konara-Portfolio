"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { CallToAction } from "@/components/call-to-action";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { TestimonialCard } from "@/components/testimonial-card";
import {
  articles,
  featuredProjects,
  serviceOfferings,
  testimonials,
} from "@/lib/content";
import portrait from "@/images/asitha-konara.jpeg";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(10,12,18,1)_0%,rgba(6,7,11,1)_40%)]">
      <main className="mx-auto max-w-6xl px-6 py-16 text-slate-200">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold leading-tight md:text-5xl"
            >
              AI Engineer &amp; Automation Developer — building scalable systems that{" "}
              <span className="text-cyan-400">think and act</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-slate-300"
            >
              I architect, ship, and scale automation platforms with Next.js, Node.js, Python, LLM Ops, and
              workflow tooling like n8n and Temporal. Ready to join a team shipping production AI products on
              day one—full-time or contract.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 font-medium text-slate-900 shadow-lg transition hover:scale-[1.02]"
              >
                Explore Projects
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/10 px-5 py-3 font-medium text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.2)] backdrop-blur-sm transition hover:border-white/20 hover:text-cyan-100"
              >
                Hire Me
              </Link>
              <Link
                href="/resume.pdf"
                className="rounded-lg border border-white/10 px-5 py-3 font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Résumé
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <div className="inline-flex items-center gap-2">
                📍 <span>Colombo • Remote-friendly (GMT+5:30)</span>
              </div>
              <div className="inline-flex items-center gap-2">
                🚀 <span>Open to Software Engineer / AI Developer roles</span>
              </div>
              <div className="inline-flex items-center gap-2">
                ⚙️ <span>React · Next.js · Node.js · Python · LLM Ops</span>
              </div>
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center">
            <div className="absolute -right-6 -top-10 h-full w-full -rotate-12 rounded-2xl bg-gradient-to-tr from-indigo-900/40 to-cyan-800/20 blur-3xl" />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-full min-h-[22rem] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            >
              <Image src={portrait} alt="Asitha Konara" fill className="object-cover" priority />
            </motion.div>
          </div>
        </section>

        <section className="mt-20 space-y-6">
          <SectionHeading
            eyebrow="Projects"
            title="Technical highlights"
            description="Selected builds where I owned architecture, delivery, and measurable outcomes across AI, automation, and DX."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard project={project} href={`/projects/${project.slug}`} />
              </motion.div>
            ))}
          </div>

          <div className="text-right">
            <Link
              href="/projects"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Browse all technical highlights →
            </Link>
          </div>
        </section>

        <section className="mt-20 space-y-6">
          <SectionHeading
            eyebrow="Value"
            title="What I offer as a developer"
            description="Full-stack product engineering from discovery to deployment—frontend polish, backend systems, AI integration, and ops readiness."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {serviceOfferings.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-right">
            <Link
              href="/services"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Explore what I offer →
            </Link>
          </div>
        </section>

        <section className="mt-20 space-y-6">
          <SectionHeading
            eyebrow="Testimonials"
            title="What people say"
            description="Signals from founders, product leads, and collaborators on shipping automation-first platforms together."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.slice(0, 4).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <div className="text-right">
            <Link
              href="/testimonials"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Read more references →
            </Link>
          </div>
        </section>

        <section className="mt-20 space-y-6">
          <SectionHeading
            eyebrow="Writing"
            title="Tech insights"
            description="Deep dives into automation, AI agents, design-to-dev pipelines, and operationalizing LLM workflows."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="text-xs uppercase tracking-wide text-cyan-300">
                  {new Date(article.publishedAt).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-100 group-hover:text-white">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-slate-400">{article.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
                  {article.readingTime} →
                </span>
              </Link>
            ))}
          </div>
          <div className="text-right">
            <Link
              href="/blog"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Browse tech insights →
            </Link>
          </div>
        </section>

        <div className="mt-20">
          <CallToAction
            title="Ready to add an AI engineer who ships?"
            description="Let’s chat about the roadmap you need help delivering—automation systems, AI agents, or DX tooling."
            primary={{ href: "/contact", label: "Book a call" }}
            secondary={{ href: "/resume.pdf", label: "Download résumé" }}
          />
        </div>
      </main >
    </div >
  );
}
