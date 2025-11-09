import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [counts, contactsLast30, recentContacts, recentProjects] = await Promise.all([
    Promise.all([
      prisma.project.count(),
      prisma.article.count(),
      prisma.serviceOffering.count(),
      prisma.testimonial.count(),
      prisma.contactSubmission.count(),
    ]),
    prisma.contactSubmission.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true, company: true },
      take: 5,
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, slug: true, updatedAt: true },
      take: 5,
    }),
  ]);

  const [projects, articles, services, testimonials, contacts] = counts;

  return {
    projects,
    articles,
    services,
    testimonials,
    contacts,
    contactsLast30,
    recentContacts,
    recentProjects,
    thirtyDaysAgo,
  };
}

export default async function AdminHomePage() {
  const stats = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Snapshot of the portfolio content currently live on the site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Projects" value={stats.projects} description="Highlighted case studies" />
        <DashboardCard label="Articles" value={stats.articles} description="Long-form insights" />
        <DashboardCard label="Services" value={stats.services} description="Available engagements" />
        <DashboardCard label="Testimonials" value={stats.testimonials} description="Published references" />
        <DashboardCard label="Contact submissions" value={stats.contacts} description="All-time inbound leads" />
        <DashboardCard
          label="Contacts last 30 days"
          value={stats.contactsLast30}
          description={`Since ${stats.thirtyDaysAgo.toLocaleDateString()}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentContacts contacts={stats.recentContacts} />
        <RecentProjects projects={stats.recentProjects} />
      </div>
    </div>
  );
}

function DashboardCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
      <div className="text-sm uppercase tracking-wide text-cyan-300">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function RecentContacts({
  contacts,
}: {
  contacts: { id: string; name: string; email: string; company: string | null; createdAt: Date }[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">Latest inbound leads</h2>
      <p className="mt-1 text-sm text-slate-400">Newest contact form submissions.</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-200">
        {contacts.length === 0 ? (
          <li className="text-slate-400">No submissions yet.</li>
        ) : (
          contacts.map((contact) => (
            <li key={contact.id} className="flex flex-col rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{contact.name}</span>
                <span className="text-xs text-slate-400">
                  {contact.createdAt.toLocaleDateString()} · {contact.createdAt.toLocaleTimeString()}
                </span>
              </div>
              <span className="text-xs text-cyan-200">{contact.email}</span>
              {contact.company ? (
                <span className="text-xs text-slate-400">{contact.company}</span>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function RecentProjects({
  projects,
}: {
  projects: { id: string; title: string; slug: string; updatedAt: Date }[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">Recently updated projects</h2>
      <p className="mt-1 text-sm text-slate-400">Your latest case study edits.</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-200">
        {projects.length === 0 ? (
          <li className="text-slate-400">No projects yet.</li>
        ) : (
          projects.map((project) => (
            <li key={project.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3">
              <span className="font-medium text-white">{project.title}</span>
              <span className="text-xs text-slate-400">
                Updated {project.updatedAt.toLocaleDateString()} {project.updatedAt.toLocaleTimeString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
