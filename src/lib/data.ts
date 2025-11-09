import { cache } from "react";

import { Prisma, Project, Article, ServiceOffering, Testimonial } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : item != null ? String(item) : ""))
      .filter((item) => item.length > 0);
  }

  return [];
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  contribution: string;
  impact: string;
  overview: string;
  challenges: string[];
  solution: string[];
  outcomes: string[];
  stack: string[];
  tech: string[];
  heroImage?: string | null;
  featured: boolean;
  createdAt: Date;
}

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage?: string | null;
  publishedAt: Date;
  readingTime: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: string | null;
  bullets: string[];
  iconImage?: string | null;
}

export interface TestimonialRecord {
  id: string;
  slug: string;
  name: string;
  role: string;
  quote: string;
  avatarImage?: string | null;
}

function mapProject(project: Project): ProjectRecord {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    summary: project.summary,
    problem: project.problem,
    contribution: project.contribution,
    impact: project.impact,
    overview: project.overview ?? project.summary,
    challenges: asStringArray(project.challenges),
    solution: asStringArray(project.solution),
    outcomes: asStringArray(project.outcomes),
    stack: asStringArray(project.stack),
    tech: asStringArray(project.tech),
    heroImage: project.heroImage,
    featured: project.featured,
    createdAt: project.createdAt,
  };
}

function mapArticle(article: Article): ArticleRecord {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    contentHtml: article.contentHtml,
    coverImage: article.coverImage,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
  };
}

function mapService(service: ServiceOffering): ServiceRecord {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    description: service.description,
    price: service.price,
    bullets: asStringArray(service.bullets),
    iconImage: service.iconImage,
  };
}

function mapTestimonial(testimonial: Testimonial): TestimonialRecord {
  return {
    id: testimonial.id,
    slug: testimonial.slug,
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    avatarImage: testimonial.avatarImage,
  };
}

export const getFeaturedProjects = cache(async () => {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return projects.map(mapProject);
});

export const getProjects = cache(async () => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return projects.map(mapProject);
});

export const getProjectBySlug = cache(async (slug: string) => {
  const project = await prisma.project.findUnique({ where: { slug } });
  return project ? mapProject(project) : null;
});

export const getArticles = cache(async () => {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  return articles.map(mapArticle);
});

export const getArticleBySlug = cache(async (slug: string) => {
  const article = await prisma.article.findUnique({ where: { slug } });
  return article ? mapArticle(article) : null;
});

export const getServices = cache(async () => {
  const services = await prisma.serviceOffering.findMany({ orderBy: { createdAt: "asc" } });
  return services.map(mapService);
});

export const getTestimonials = cache(async () => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return testimonials.map(mapTestimonial);
});
