import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Testimonials</h1>
        <p className="mt-1 text-sm text-slate-400">
          Collect and publish new references from clients, collaborators, and peers.
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
