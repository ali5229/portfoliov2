// All editable copy for the site. Components read from here; change text here, not in JSX.

export type LedgerEntry = { entry: string; text: string };

export type Case = {
  label: string;
  title: string;
  summary: string;
  ledger: LedgerEntry[];
  tags: string[];
  /** Featured layout: table gets a header row and tags sit under the summary. */
  featured?: boolean;
};

export type SideProject = { label: string; title: string; body: string; tags?: string[] };

export type Job = {
  period: string;
  role: string;
  org: string;
  bullets?: string[];
  body?: string;
};

export type StackItem = { name: string; core?: boolean };
export type StackGroup = { code: string; name: string; items: StackItem[] };

export const site = {
  title: "Ali Abbas - Software Engineer",
  description:
    "Muhammad Ali Abbas, software engineer building POS, accounting and farm-management systems that businesses run every day.",
  email: "aliabbas55506@gmail.com",
  mark: { first: "ALI", sep: "/", last: "ABBAS" },
  availability: "Open to roles",
  socials: [
    { label: "GitHub ↗", href: "https://github.com/ali5229" },
    { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/ali5229/" },
    { label: "X ↗", href: "https://x.com/aliabbas55506" },
  ],
  footer: { copyright: "© 2026 Muhammad Ali Abbas", },
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Architecture", href: "#architecture" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  label: "Software Engineer · Sargodha, Pakistan",
  /** Words rise in one by one; the emphasis part gets the accent colour and the drawn underline. */
  headline: "I build the software businesses",
  headlineEmphasis: "run their day on.",
  lede: "POS, inventory and accounting systems used daily by distributors, farms and traders.",
  ledeStrong: "I write the code, deploy it to production, and keep it running.",
  primaryCta: { label: "See the systems →", href: "#work" },
  copyLabel: "Copy email",
  meta: [
    { label: "Now", value: "Switch2iTech" },
    { label: "Core stack", value: "Next.js · Prisma · PostgreSQL" },
    { label: "Degree", value: "BSCS, Univ. of Sargodha" },
  ],
};

export const receipt = {
  title: "ALI ABBAS · SOFTWARE",
  subtitle: "Production log · 2025–26",
  header: [
    { label: "INV #", value: "SW2-0001" },
    { label: "CASHIER", value: "M. Ali Abbas" },
  ],
  items: [
    { label: "Distribution + POS system", value: "1 × prod" },
    { label: "Poultry farm module (FCR)", value: "1 × prod" },
    { label: "Multi-tenant DB routing", value: "1 × prod" },
    { label: "FBR Digital Invoicing API", value: "✓ live", ok: true },
    { label: "Daily backups → Cloudflare R2", value: "✓ 24h", ok: true },
    { label: "Audit / activity logging", value: "✓ on", ok: true },
  ],
  sectorsServed: { label: "Sectors served", value: "5+" },
  total: { label: "STATUS", value: "IN PRODUCTION" },
  thanks: "Thank you for scrolling",
  stamp: "SHIPPED",
};

export const sectors = {
  label: "Running at businesses in",
  list: ["Dry fruit", "Tyres", "Fish market", "Cement", "Poultry", "Wholesale distribution"],
};

export const work = {
  label: "Production systems",
  title: "Software that keeps the books straight.",
  intro:
    "Each system replaces paper registers and spreadsheets for a real business. One shared codebase, configured per client.",
  featured: {
    featured: true,
    label: "Switch2iTech · Core product",
    title: "Distribution & POS System",
    summary:
      "One workflow for wholesalers and distributors: counter sales, route sales, warehouse stock and supplier purchases. Every sale, payment and return posts to the books automatically.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "shadcn/ui"],
    ledger: [
      { entry: "Accounts", text: "Vouchers and a chart of accounts so sales flow into accounting without double entry." },
      { entry: "Receivable", text: "Customer and supplier ledgers that show who owes what at any moment." },
      { entry: "Per-client", text: "Configurable themes, screen-level permissions and invoice layouts from one codebase." },
      { entry: "Tax", text: "FBR Digital Invoicing API integration for compliant e-invoices." },
      { entry: "Audit", text: "Detailed user activity logs with filtering for traceability." },
    ],
  } satisfies Case,
  duo: [
    {
      label: "Agriculture module",
      title: "Poultry Farm Management",
      summary:
        "Tracks the full flock cycle and ties it to money: farm, unit and flock finances, daily feed, mortality and warehouse stock issuance.",
      tags: ["Next.js", "Prisma", "PostgreSQL"],
      ledger: [
        { entry: "FCR", text: "Feed conversion ratio per flock, from daily feed and weight data." },
        { entry: "Books", text: "Double-entry ledgers and trial balance aligned with daily operations." },
        { entry: "Reports", text: "Flock timelines and profit reports to control cost per bird." },
      ],
    },
    {
      label: "Operations",
      title: "Deployment & Reliability",
      summary:
        "I run what I ship. Client apps live on a Hostinger VPS managed through Dokploy, with off-server backups.",
      tags: ["Dokploy", "Hostinger VPS", "Cloudflare R2", "Redis"],
      ledger: [
        { entry: "Deploy", text: "Dokploy on VPS, server setup and troubleshooting over SSH (PuTTY)." },
        { entry: "Backup", text: "Automated daily database backups stored in Cloudflare R2." },
        { entry: "Support", text: "Production fixes and client-specific changes on a live system." },
      ],
    },
  ] satisfies Case[],
};

export const architecture = {
  label: "How it's built",
  title: "One app, a separate database per client",
  body: "I designed the multi-tenant setup: after login, the server resolves which business the user belongs to and connects to that client's PostgreSQL database. Data stays isolated while every client runs the same codebase.",
  /** Cycles every 1.4s, in step with the packets in the diagram. */
  logs: [
    "GET /api/sales → tenant: tyre-co → db_tyre",
    "POST /api/flocks/feed → tenant: green-poultry → db_poultry",
    "GET /api/ledger → tenant: cement-traders → db_cement",
  ],
};

export const projects = {
  label: "Other builds",
  title: "Projects outside work",
  items: [
    {
      label: "Final year project",
      title: "Personalized Workout App",
      body: "Mobile app that uses the OpenAI API to generate workout plans from a user's health data, backed by a categorized exercise library with guides and videos.",
      tags: ["React Native", "Firebase", "OpenAI API"],
    },
    {
      label: "Web",
      title: "E-commerce Store",
      body: "Product listings, search, filtering and authentication with a responsive storefront.",
    },
    {
      label: "Android",
      title: "Video & Voice Call App",
      body: "Real-time audio and video calling built on ZegoCloud with a Jetpack Compose interface.",
      tags: ["Java", "ZegoCloud", "Jetpack Compose"],
    },
  ] satisfies SideProject[],
};

export const experience = {
  label: "Experience",
  title: "Where I've worked",
  jobs: [
    {
      period: "2025 – Present",
      role: "Software Engineer",
      org: "Switch2iTech",
      bullets: [
        "Develop and maintain a distribution management and POS system covering sales, purchases, inventory, accounts and reports.",
        "Maintain one shared codebase with client-specific configuration for dry fruit, tyre, fish market, cement and other businesses.",
        "Built the multi-tenant architecture that picks a database connection per authenticated user.",
        "Built poultry farm features: flock finances, daily feed, mortality, FCR and stock issuance.",
        "Integrated the FBR Digital Invoicing API; deploy and run production on Hostinger VPS with Dokploy and daily R2 backups.",
      ],
    },
    {
      period: "2025 · 3 months",
      role: "Full-Stack Developer Intern",
      org: "DevelopersHub.co",
      body: "Built several full-stack projects with the team and delivered tasks within set deadlines.",
    },
    {
      period: "2021 – 2025",
      role: "BS Computer Science",
      org: "University of Sargodha",
      body: "CGPA 3.2 / 4.00. HackerRank certified in Problem Solving and JavaScript.",
    },
  ] satisfies Job[],
};

export const stack = {
  label: "Stack",
  title: "What I use",
  intro: "Highlighted tools are the ones I use in production every week.",
  tallyLabel: "Items scanned",
  status: { ready: "Ready to scan", scanning: "Scanning…", done: "All items in stock" },
  /** `core: true` = highlighted. The scan counter total is derived from this list. */
  groups: [
    {
      code: "LNG-01",
      name: "Languages",
      items: [
        { name: "TypeScript", core: true },
        { name: "JavaScript", core: true },
        { name: "Java" },
        { name: "C#" },
        { name: "C++" },
        { name: "C" },
      ],
    },
    {
      code: "FE-02",
      name: "Frontend",
      items: [
        { name: "Next.js", core: true },
        { name: "React", core: true },
        { name: "Vue.js" },
        { name: "shadcn/ui" },
        { name: "HTML" },
        { name: "CSS" },
      ],
    },
    {
      code: "BE-03",
      name: "Backend",
      items: [{ name: "Node.js", core: true }, { name: "Express" }, { name: "REST APIs" }, { name: "Redis" }],
    },
    {
      code: "DB-04",
      name: "Data",
      items: [
        { name: "PostgreSQL", core: true },
        { name: "Prisma", core: true },
        { name: "MongoDB" },
        { name: "MySQL" },
        { name: "SQLite" },
        { name: "Firebase" },
      ],
    },
    {
      code: "OPS-05",
      name: "Ops",
      items: [
        { name: "Dokploy", core: true },
        { name: "Hostinger VPS", core: true },
        { name: "Cloudflare R2" },
        { name: "Git" },
        { name: "Postman" },
      ],
    },
  ] satisfies StackGroup[],
};

export const contact = {
  label: "Contact",
  title: "Have a business that runs on paper? Let's fix that.",
  copyLabel: "Copy",
};
