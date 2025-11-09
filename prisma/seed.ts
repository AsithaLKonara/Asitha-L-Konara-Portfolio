import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  articleDetails,
  articles,
  projectCaseStudies,
  projectSummaries,
  serviceOfferings,
  testimonials,
} from "./seed-data";

const prisma = new PrismaClient();

const articleDetailsMap = new Map(articleDetails.map((detail) => [detail.slug, detail]));

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding");
  }

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

async function seedProjects() {
  await prisma.project.deleteMany();

  const caseStudyBySlug = new Map(projectCaseStudies.map((entry) => [entry.slug, entry]));

  for (const summary of projectSummaries) {
    const detail = caseStudyBySlug.get(summary.slug);

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

async function seedArticles() {
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

async function seedServices() {
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

async function seedTestimonials() {
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

async function main() {
  await seedAdmin();
  await seedProjects();
  await seedArticles();
  await seedServices();
  await seedTestimonials();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
