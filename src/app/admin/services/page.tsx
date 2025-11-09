import { ServicesManager } from "@/components/admin/services-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const services = await prisma.serviceOffering.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <p className="mt-1 text-sm text-slate-400">
          Update the engagements and offerings displayed on the services page.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
