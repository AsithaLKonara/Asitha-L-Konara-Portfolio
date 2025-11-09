import bcrypt from "bcryptjs";
import type { PrismaClient } from "../src/generated/prisma/client";

import {
  articleDetails,
  articles,
  projectCaseStudies,
  projectSummaries,
  serviceOfferings,
  testimonials,
} from "./seed-data";

const articleDetailsMap = new Map(articleDetails.map((detail) => [detail.slug, detail]));
const projectCaseStudyMap = new Map(projectCaseStudies.map((entry) => [entry.slug, entry]));

export interface SeedOptions {
  adminEmail: string;
  adminPassword: string;
}

export async function seedDatabase(prisma: PrismaClient, options: SeedOptions) {
  const { adminEmail, adminPassword } = options;

  if (!adminEmail || !adminPassword) {
    throw new Error("seedDatabase requires adminEmail and adminPassword");
  }

  await seedAdmin(prisma, adminEmail, adminPassword);
  await seedProjects(prisma);
  await seedArticles(prisma);
  await seedServices(prisma);
  await seedTestimonials(prisma);
}

async function seedAdmin(prisma: PrismaClient, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
    },
  });
}

async function seedProjects(prisma: PrismaClient) {
  await prisma.project.deleteMany();

  for (const summary of projectSummaries) {
    const detail = projectCaseStudyMap.get(summary.slug);

    await prisma.project.create({
      data: {
        slug: summary.slug,
        title: summary.title,
        tagline: summary.tagline,
        summary: summary.summary,
        problem: summary.problem,
        contribution: summary.contribution,
        impact: summary.impact,
        overview: detail?.overview ?? summary.summary,
        challenges: detail?.challenges ?? [],
        solution: detail?.solution ?? [],
        outcomes: detail?.outcomes ?? [summary.impact],
        stack: detail?.stack ?? summary.tech,
        tech: summary.tech,
        heroImage: (summary as { heroImage?: string }).heroImage ?? null,
        featured: summary.featured ?? false,
      },
    });
  }
}

async function seedArticles(prisma: PrismaClient) {
  await prisma.article.deleteMany();

  for (const article of articles) {
    const detail = articleDetailsMap.get(article.slug);
    const paragraphs = detail?.content ?? [article.excerpt];
    const contentHtml = paragraphs
      .map((paragraph) => `<p>${paragraph.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
      .join("\n");

    await prisma.article.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        contentHtml,
        coverImage: (article as { coverImage?: string }).coverImage ?? null,
        publishedAt: new Date(article.publishedAt),
        readingTime: article.readingTime,
      },
    });
  }
}

async function seedServices(prisma: PrismaClient) {
  await prisma.serviceOffering.deleteMany();

  for (const service of serviceOfferings) {
    await prisma.serviceOffering.create({
      data: {
        slug: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        bullets: service.bullets,
        iconImage: service.iconImage ?? null,
      },
    });
  }
}

async function seedTestimonials(prisma: PrismaClient) {
  await prisma.testimonial.deleteMany();

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        slug: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        avatarImage: testimonial.avatarImage ?? null,
      },
    });
  }
}

