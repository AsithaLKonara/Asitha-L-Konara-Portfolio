export const projectSummaries = [
  {
    slug: "automatelanka",
    title: "AutomateLanka",
    tagline: "Workflow marketplace and execution engine for n8n automations.",
    problem: "Operators juggled fragmented n8n workflows with no secure execution layer.",
    contribution:
      "Designed and shipped the multi-tenant marketplace, contributor onboarding, billing flows, and managed runtime.",
    impact: "Scaled to 2,000+ published workflows and onboarded enterprise automation teams in <48 hours.",
    tech: ["Next.js", "Node.js", "n8n", "Temporal", "Stripe"],
    summary:
      "Designed and delivered a managed automation marketplace with contributor onboarding, monetization, and a compliant execution runtime.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "jarvisx",
    title: "JarvisX",
    tagline: "Desktop AI agent orchestrating OS-level automations and research.",
    problem: "Analysts needed an auditable desktop assistant to orchestrate local tools and AI safely.",
    contribution:
      "Built the Electron runtime, secure sandboxing, LLM orchestration flows, and deterministic fallbacks with telemetry.",
    impact: "Reduced manual research time by 60% while meeting enterprise security controls.",
    tech: ["Electron", "Python", "LangChain", "DuckDB", "Playwright"],
    summary:
      "Architected a desktop AI co-pilot blending deterministic scripts with LLM planning while maintaining enterprise observability and audit trails.",
    heroImage:
      "https://images.unsplash.com/photo-1526378722484-cc5c81033435?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "leadtap",
    title: "LeadTap",
    tagline: "Lead scraping and enrichment across Google Maps and social channels.",
    problem: "Growth teams lacked reliable, enriched SMB leads synced into their CRMs.",
    contribution:
      "Implemented resilient scraping with rotating proxies, enrichment pipeline, dedupe logic, and CRM exports.",
    impact: "Delivers 10k+ verified leads monthly with push-to-CRM automations.",
    tech: ["Node.js", "Puppeteer", "AWS", "Airflow", "Zapier"],
    summary:
      "Implemented a resilient lead engine with rotating proxies, enrichment, dedupe logic, and real-time CRM sync for growth teams.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "specs-extractor",
    title: "Specs Extractor",
    tagline: "Figma → JSON extractor for designer-to-developer handoffs.",
    problem: "Design and engineering teams lacked an authoritative spec to move designs into production code.",
    contribution:
      "Created Figma/Adobe plugins, JSON spec generator, design token QA, and CI-ready export pipeline.",
    impact: "Cut design-to-dev handoff cycles by 45% across partner teams.",
    tech: ["TypeScript", "Figma Plugin API", "Adobe UXP", "Cloud Functions"],
    summary:
      "Built cross-platform plugins that translate designs into versioned JSON specs with automated QA and CI-ready exports.",
    heroImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
];

export const projectCaseStudies = projectSummaries.map((summary) => {
  switch (summary.slug) {
    case "automatelanka":
      return {
        ...summary,
        overview:
          "AutomateLanka enables operators to buy, sell, and run n8n workflows in a managed SaaS environment with billing, governance, and observability built in.",
        challenges: [
          "Fragmented automation templates with no shared execution surface",
          "Enterprise buyers required security guardrails and multi-tenant isolation",
        ],
        solution: [
          "Designed marketplace architecture with contributor onboarding, verification, and revenue share flows",
          "Implemented managed execution environment with secrets vault, rate limiting, and per-tenant observability dashboards",
        ],
        outcomes: [
          "2,000+ workflows published with contributor monetization",
          "Average deployment time reduced from weeks to <48 hours",
        ],
        stack: ["Next.js", "n8n", "PostgreSQL", "Temporal", "Stripe"],
      };
    case "jarvisx":
      return {
        ...summary,
        overview:
          "JarvisX is a desktop automation co-pilot that bridges local tooling, data pipelines, and LLM agents to execute complex analyst workflows end-to-end.",
        challenges: [
          "Operators needed OS-level control with enterprise auditability",
          "LLM orchestration had to fail gracefully and surface explanations",
        ],
        solution: [
          "Developed Electron-based runtime with secure sandboxing and privilege escalation workflows",
          "Composed multi-agent orchestration with deterministic fallbacks and structured logging",
        ],
        outcomes: [
          "60% reduction in manual research time",
          "Expanded analyst capacity without additional headcount",
        ],
        stack: ["Electron", "Python", "LangChain", "DuckDB", "Playwright"],
      };
    case "leadtap":
      return {
        ...summary,
        overview:
          "LeadTap continuously harvests, enriches, and deduplicates local business leads across Google Maps, social platforms, and proprietary sources.",
        challenges: [
          "Needed resilient scraping infrastructure that adapts to UI shifts",
          "Sales teams required clean exports and CRM-ready enrichment",
        ],
        solution: [
          "Implemented rotating proxy infrastructure with anomaly detection and recovery",
          "Built enrichment pipeline layering social data, technographics, and contact scoring",
        ],
        outcomes: ["10k+ verified leads delivered monthly", "Automated exports to HubSpot and Salesforce"],
        stack: ["Node.js", "Puppeteer", "AWS", "Airflow", "Zapier"],
      };
    case "specs-extractor":
      return {
        ...summary,
        overview:
          "Specs Extractor converts Figma designs into structured JSON specs with handoff-ready design tokens and automated QA checks.",
        challenges: [
          "Designers and engineers lacked a shared source of truth for components",
          "Needed compatibility with both Figma and Adobe UXP ecosystems",
        ],
        solution: [
          "Developed plugin architecture that maps layout elements to reusable components",
          "Automated linting for accessibility, spacing, and token usage before handoff",
        ],
        outcomes: ["Cut handoff cycles by 45%", "Improved design QA accuracy across teams"],
        stack: ["Figma Plugin API", "Adobe UXP", "TypeScript", "Cloud Functions"],
      };
    default:
      return {
        ...summary,
        overview: summary.summary,
        challenges: [],
        solution: [],
        outcomes: [summary.impact],
        stack: summary.tech,
      };
  }
});

export const articles = [
  {
    slug: "shipping-production-llm-ops",
    title: "Shipping Production LLM Ops Without Surprises",
    excerpt:
      "Patterns for observability, evaluation, and fallbacks that kept JarvisX compliant and trustworthy for enterprise analysts.",
    publishedAt: "2024-09-18",
    readingTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "automating-2000-workflows",
    title: "Automating 2,000+ Workflows With n8n & Temporal",
    excerpt:
      "How we scaled AutomateLanka’s managed automation marketplace with tight SLAs, billing, and governance baked in.",
    publishedAt: "2024-07-03",
    readingTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1517777596326-9dfd34510456?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "design-handoff-to-code",
    title: "Design Handoff to Code: Building the Specs Extractor",
    excerpt:
      "A look at generating production-ready specs from Figma and Adobe UXP with automated QA and CI pipelines.",
    publishedAt: "2024-03-22",
    readingTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  },
];

export const articleDetails = articles.map((article) => {
  switch (article.slug) {
    case "shipping-production-llm-ops":
      return {
        ...article,
        content: [
          "Enterprise analysts needed an AI assistant they could trust in regulated environments. JarvisX blended deterministic automations with LLM planning, but only after we layered in ruthless observability.",
          "We instrumented every prompt, tool invocation, and fall back path. Evaluations ran nightly on red-team scenarios so we could ship confidently and catch regressions early.",
          "This post walks through the guardrails, monitoring topology, and human-in-the-loop patterns that let us deploy LLM features without surprises.",
        ],
      };
    case "automating-2000-workflows":
      return {
        ...article,
        content: [
          "AutomateLanka started as a handful of n8n templates. Scaling to 2,000+ workflows meant solving monetization, governance, and runtime isolation.",
          "We paired Temporal with n8n to guarantee executions, bake in retries, and surface observability dashboards to every tenant.",
          "Inside you’ll find the contributor loops, billing architecture, and operations playbooks that kept the marketplace reliable as it grew.",
        ],
      };
    case "design-handoff-to-code":
      return {
        ...article,
        content: [
          "Specs Extractor was built to end the ‘guess the spacing’ era between design and engineering teams.",
          "It reads Figma documents, translates them into structured JSON, and runs automated QA so developers receive publish-ready tokens.",
          "Learn how the plugin architecture, CI integrations, and feedback loops helped multiple teams ship faster without sacrificing accuracy.",
        ],
      };
    default:
      return { ...article, content: [article.excerpt] };
  }
});

export const serviceOfferings = [
  {
    id: "ai-automation",
    name: "AI & Automation Engineering",
    description:
      "Design and deploy production-grade automation platforms powered by LLMs, deterministic workflows, and guardrails.",
    price: "Contract from $80/hr",
    bullets: [
      "Map automation surface area and success metrics",
      "Compose multi-agent and deterministic orchestration",
      "Ship monitoring, governance, and rollout playbooks",
    ],
    iconImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "marketplaces",
    name: "Product & Platform Engineering",
    description:
      "Ship customer-facing SaaS and marketplace surfaces with robust contributor tooling and analytics loops.",
    bullets: [
      "Product strategy, architecture, and delivery leadership",
      "Contributor or customer onboarding experiences",
      "Usage analytics, monetization, and instrumentation",
    ],
    iconImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "developer-experience",
    name: "Developer Experience & Tooling",
    description:
      "Elevate designer-to-developer pipelines with internal tooling, linting, and integrations that teams adopt.",
    bullets: [
      "Design token and component pipelines",
      "Plugin & extension development across ecosystems",
      "Integration rollouts and enablement sessions",
    ],
    iconImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
  },
];

export const testimonials = [
  {
    id: "cfo-automatelanka",
    name: "Dineth Siriwardena",
    role: "COO, AutomateLanka",
    quote:
      "Asitha architected our automation engine from zero to thousands of workflows—production reliability went up while our ops headcount went down.",
    avatarImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "product-lead-agency",
    name: "Maya Fernando",
    role: "Head of Product, Atlas Creative",
    quote:
      "He delivered a Figma-to-code pipeline that slashed delivery timelines by weeks and gave designers instant feedback on feasibility.",
    avatarImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "founder-saas",
    name: "Sahan Jayasuriya",
    role: "Founder, RelayOps",
    quote:
      "From ideation to GTM, Asitha's automation expertise helped us move from prototype to paying customers in record time.",
    avatarImage: "https://images.unsplash.com/photo-1544723795-432537bd5df1?auto=format&fit=crop&w=256&q=80",
  },
];
