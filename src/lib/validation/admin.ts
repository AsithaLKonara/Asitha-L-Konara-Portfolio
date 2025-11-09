import { z } from "zod";

const stringListSchema = z.array(z.string().trim().min(1)).default([]);

export const projectInputSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  contribution: z.string().trim().min(1),
  impact: z.string().trim().min(1),
  overview: z.string().trim().optional(),
  challenges: stringListSchema,
  solution: stringListSchema,
  outcomes: stringListSchema,
  stack: stringListSchema,
  tech: stringListSchema,
  featured: z.boolean().optional().default(false),
  heroImage: z.string().trim().optional(),
});

export const articleInputSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  contentHtml: z.string().trim().default(""),
  coverImage: z.string().trim().optional(),
  publishedAt: z.coerce.date(),
  readingTime: z.string().trim().min(1),
});

export const serviceInputSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.string().trim().optional(),
  bullets: stringListSchema,
  iconImage: z.string().trim().optional(),
});

export const testimonialInputSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  quote: z.string().trim().min(1),
  avatarImage: z.string().trim().optional(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
