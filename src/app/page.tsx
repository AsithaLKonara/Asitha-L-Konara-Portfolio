import { HomeClient } from "@/components/home/home-client";
import { getArticles, getFeaturedProjects, getServices, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [projects, services, testimonials, articles] = await Promise.all([
    getFeaturedProjects(),
    getServices(),
    getTestimonials(),
    getArticles(),
  ]);

  return (
    <HomeClient
      featuredProjects={projects.map((project) => ({
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
      services={services.map((service) => ({
        id: service.id,
        slug: service.slug,
        name: service.name,
        description: service.description,
        price: service.price,
        bullets: service.bullets,
        iconImage: service.iconImage,
      }))}
      testimonials={testimonials.map((testimonial) => ({
        id: testimonial.id,
        slug: testimonial.slug,
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        avatarImage: testimonial.avatarImage,
      }))}
      articles={articles.slice(0, 3).map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        publishedAt: article.publishedAt.toISOString(),
        readingTime: article.readingTime,
        coverImage: article.coverImage,
      }))}
    />
  );
}
