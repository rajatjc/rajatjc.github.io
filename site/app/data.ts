// All site copy lives here. Facts come from resume.tex; keep the two in sync.

export const profile = {
  name: "Rajat Sharma",
  role: "Backend & Platform Engineer",
  location: "Toronto, Ontario",
  email: "rajat.jc@gmail.com",
  url: "https://rajatjc.github.io",
  status: "Open to backend and platform roles",
  tagline:
    "I build the systems behind the screen: multi-tenant SaaS on Kubernetes at IBM, and event-driven services on Kafka and Cassandra.",
  description:
    "Backend and platform engineer at IBM in Toronto. Java, Go, Spring Boot, Kafka, Cassandra and Kubernetes. Builder of lsm-kv, an LSM-tree storage engine in Java.",
};

// Versioned by next.config.ts so a new résumé is never served from cache.
export const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf";

export const socials = [
  { label: "GitHub", href: "https://github.com/rajatjc", handle: "rajatjc" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rajatjc", handle: "in/rajatjc" },
  { label: "LeetCode", href: "https://leetcode.com/rajatjc/", handle: "rajatjc" },
  { label: "X", href: "https://x.com/rajatjcc", handle: "@rajatjcc" },
];

export const stats = [
  { value: 500, suffix: "K+", label: "Kafka events a day under watch by a monitor I built" },
  { value: 65, suffix: "%", label: "lower lookup latency after a Cassandra schema redesign" },
  { value: 10, suffix: "+", label: "production Kubernetes clusters shipped to with GitOps" },
  { value: 3, suffix: " µs", label: "per write in lsm-kv, my storage engine (JMH)" },
];

export const about = [
  "I'm a software developer at IBM in Markham, on Maximo Small SaaS: a multi-tenant platform that runs Maximo Manage for many customers on Kubernetes and OpenShift. Day to day I write Go and Python services, Helm charts, Terraform and GitOps pipelines, and the tools our SREs use to see the health of every tenant.",
  "Before that I spent a year and a half on IBM Envizi, building Java and Spring Boot microservices on Kafka and Cassandra for ESG reporting.",
  "I care about systems that fail safely, APIs that are hard to misuse, and numbers that prove a change worked. Outside work I build things to understand them, like a storage engine and a toy bank, and I solve problems on LeetCode and CodeChef.",
];

export const now = [
  { label: "At work", text: "Tenant lifecycle, identity (OIDC) and SRE tooling for Maximo SaaS at IBM." },
  { label: "Building", text: "lsm-kv, an LSM-tree key-value store in Java 21 with a live web UI." },
  { label: "Shipping", text: "Loonie Ledger, a demo neobank, one service at a time on GitHub." },
];

export const education = [
  {
    school: "Concordia University",
    degree: "Master of Applied Computer Science",
    detail: "GPA 3.6 / 4.3 · Golden Key Scholar",
    dates: "2022 – 2024",
    place: "Montreal",
  },
  {
    school: "Guru Gobind Singh Indraprastha University",
    degree: "B.Tech, Information Technology",
    detail: "GPA 3.9 / 4.3",
    dates: "2017 – 2021",
    place: "New Delhi",
  },
];

export type Job = {
  company: string;
  team?: string;
  title: string;
  dates: string;
  place: string;
  points: string[];
  tech: string[];
};

export const jobs: Job[] = [
  {
    company: "IBM",
    team: "Maximo Small SaaS",
    title: "Software Developer",
    dates: "Apr 2026 – Present",
    place: "Markham, ON",
    points: [
      "Build and run a multi-tenant Maximo Manage-as-a-Service platform on Kubernetes and OpenShift, across 19 container images and 11 Helm charts, with every change gated by Helm tests and Tekton pipelines.",
      "Re-keyed tenant identifiers so tenants can migrate between tenant groups, and automated Db2 setup on Amazon RDS with stored procedures, removing hand-run steps from provisioning.",
      "Built a Go tenant-health API and a Next.js SRE dashboard linked to Instana, Loki and Grafana, so SREs can see provisioning, deletion and stuck tenants in one place.",
      "Closed SQL-injection paths in a Python helper, added secret scanning, patched Go dependency CVEs, and wrote Terraform for AWS accounts with PR-driven Atlantis plans.",
    ],
    tech: ["Go", "Python", "Kubernetes", "OpenShift", "Helm", "Tekton", "Argo CD", "Terraform", "AWS", "Db2", "Next.js"],
  },
  {
    company: "IBM",
    team: "Envizi",
    title: "Software Developer",
    dates: "Oct 2024 – Mar 2026",
    place: "Markham, ON",
    points: [
      "Designed a denormalized Cassandra schema for hierarchical organization data, with four query-specific tables, cutting lookup latency by 65% across four production clusters.",
      "Built a Kafka monitoring service that watches 30+ topics and 500K+ events a day. Redis-backed locks and alert deduplication cut alert noise by 90% while still catching outages in under a minute.",
      "Designed the Navigation DSL API behind Portal 2.0's configurable UI, with multi-level validation, idempotent duplicate detection and automatic cleanup after partial failures.",
      "Cut XBRL taxonomy load time from 5 s to 1 s with LRU caching, and patched a Kafka client CVE across 5+ microservices running on 10+ Kubernetes clusters.",
    ],
    tech: ["Java", "Spring Boot", "Python", "Cassandra", "Kafka", "Redis", "Kubernetes", "Argo CD"],
  },
  {
    company: "Concordia University",
    title: "Developer",
    dates: "Sep 2022 – Jan 2024",
    place: "Montreal, QC",
    points: [
      "Led a project to streamline deployments with Java, Angular and Kubernetes, cutting deployment time and developer workload by 44%.",
      "Built Spring Boot APIs that integrate with 12+ applications, and tuned MongoDB queries to cut data retrieval time by 20%.",
      "Won the Golden Key Scholarship for automation that saved more than 100 hours of manual work a week.",
    ],
    tech: ["Java", "Spring Boot", "Angular", "MongoDB", "Kubernetes"],
  },
  {
    company: "Tejas Networks",
    title: "Software Developer",
    dates: "Aug 2021 – Aug 2022",
    place: "New Delhi, India",
    points: [
      "Modernized TejNMS, a telecom network-management system, with Spring Boot and an MVC architecture, improving resource-allocation efficiency by 30% and cutting manual recovery time by 20%.",
      "Led a team of three in migrating from ActiveMQ to Kafka, reducing processing time by 20%.",
      "Wrote the SQL for ETL jobs that merge data from several sources into reports.",
    ],
    tech: ["Java", "Spring Boot", "Kafka", "SQL", "AngularJS"],
  },
  {
    company: "Verbose Techlabs",
    title: "Software Engineer",
    dates: "Sep 2020 – Jul 2021",
    place: "New Delhi, India",
    points: [
      "Built microservices and backend platform features in Java and Scala.",
      "Cut the product-search API's response time from 550 ms to 200 ms.",
      "Hosted a component library on AWS S3 and CloudFront, with authentication through Lambda and Cognito.",
    ],
    tech: ["Java", "Scala", "AWS", "Jenkins"],
  },
];

export type Project = {
  name: string;
  blurb: string;
  points?: string[];
  tech: string[];
  repo?: string;
  demo?: string;
  demoLabel?: string;
  demoNote?: string;
  badge?: string;
  metrics?: { value: string; label: string }[];
  // Screenshots in public/, 400 × 760. href opens the game on that item.
  shots?: { src: string; alt: string; caption: string; href: string }[];
};

export const featured: Project[] = [
  {
    name: "lsm-kv",
    blurb:
      "A log-structured merge-tree key-value store, built from scratch in Java 21. It's the storage design behind Cassandra, RocksDB and LevelDB.",
    points: [
      "CRC-checked write-ahead log with crash recovery. Replay stops cleanly at a torn tail.",
      "Memory-mapped SSTables with sparse indexes and Bloom filters, plus size-tiered compaction through a streaming k-way merge.",
      "Dependency-free HTTP API on virtual threads, with a live UI that shows flushes, compactions and pods being replaced in Kubernetes.",
    ],
    metrics: [
      { value: "3 µs", label: "per write (JMH)" },
      { value: "17×", label: "cheaper lookups for missing keys, thanks to Bloom filters" },
    ],
    tech: ["Java 21", "Gradle", "JUnit", "JMH", "Docker", "Kubernetes"],
    repo: "https://github.com/rajatjc/lsm-kv",
    demo: "https://lsm-kv.onrender.com",
    demoNote: "Free tier: the first load can take about a minute.",
  },
  {
    name: "Loonie Ledger",
    blurb:
      "A demo Canadian neobank: three services in three languages that never call each other. Every transfer is checked for fraud and compliance before any money moves.",
    points: [
      "Java and Spring Boot payments service with a double-entry ledger and a transactional outbox, so no event is ever lost.",
      "Python fraud scoring and Node.js compliance consume Redis Streams consumer groups: at-least-once delivery, idempotent handlers.",
      "SHA-256 hash-chained audit log, and a browser ops console that runs kubectl, redis-cli and psql against the live system.",
    ],
    tech: ["Java 21", "Spring Boot", "Python", "FastAPI", "TypeScript", "Redis Streams", "PostgreSQL", "Kubernetes"],
    repo: "https://github.com/rajatjc/loonie-ledger",
    badge: "Publishing now",
  },
  {
    name: "Happy Peeler",
    blurb:
      "A free browser game. A blade sweeps across the board, and you tap to shave strips off fruit, vegetables, gadgets and planets. Clear every bit of skin in five peels or fewer.",
    points: [
      "Fruit, gadgets, stickers and planets, all drawn on a 2D canvas with Path2D, at five motion levels from still to wild. No framework or game engine.",
      "Each run is scored by counting the skin pixels left on the canvas, so the result matches exactly what the player sees.",
      "Worldwide rankings on Cloudflare Pages Functions and D1. Finish times are stored only as counts per 100 ms bucket, so every run is ranked without keeping anything about the player.",
    ],
    tech: ["JavaScript", "Canvas 2D", "Web Audio", "Cloudflare Pages", "Cloudflare D1", "SQL"],
    demo: "https://happypeeler.com",
    demoLabel: "Play it",
    shots: [
      { src: "/projects/happy-peeler/avocado.jpg", alt: "An avocado half peeled, with the blade sweeping over it", caption: "Avocado", href: "https://happypeeler.com/#avocado" },
      { src: "/projects/happy-peeler/phone.jpg", alt: "A phone with its screen protector being peeled off in strips", caption: "Phone", href: "https://happypeeler.com/#phone" },
      { src: "/projects/happy-peeler/earth.jpg", alt: "Earth with the clouds peeled off its lower half", caption: "Earth", href: "https://happypeeler.com/#earth" },
    ],
  },
];

export const moreProjects: Project[] = [
  {
    name: "DreamShops",
    blurb: "A shopping-cart REST backend with products, categories and carts, secured with Spring Security and JWT.",
    tech: ["Java", "Spring Boot", "Spring Security", "PostgreSQL", "Docker"],
    repo: "https://github.com/rajatjc/DreamShops",
  },
  {
    name: "CareerLinkup",
    blurb: "A job portal for job seekers and employers, with role-based access and CircleCI deployments.",
    tech: ["Python", "Flask", "SQLAlchemy", "SQLite", "CircleCI"],
    repo: "https://github.com/rajatjc/CareerLinkup",
  },
  {
    name: "Graph Coloring",
    blurb: "Compares online graph-coloring algorithms, First Fit and CBIP, on generated graphs.",
    tech: ["Python", "Flask", "Jupyter"],
    repo: "https://github.com/rajatjc/GraphColoring",
  },
];

export const skills = [
  { group: "Languages", items: ["Java", "Go", "Python", "TypeScript", "SQL", "Scala", "C++", "Bash"] },
  { group: "Backend", items: ["Spring Boot", "FastAPI", "Flask", "Node.js", "REST", "Kafka", "Redis Streams"] },
  { group: "Data", items: ["Cassandra", "PostgreSQL", "Db2", "MySQL", "MongoDB", "Redis", "DynamoDB"] },
  {
    group: "Platform",
    items: ["Kubernetes", "OpenShift", "Docker", "Helm", "Argo CD", "Tekton", "Terraform", "AWS", "GitHub Actions"],
  },
  { group: "Observability", items: ["OpenTelemetry", "Instana", "Grafana", "Loki", "OIDC / OAuth"] },
  { group: "Testing", items: ["JUnit", "JMH", "Testcontainers", "Pytest", "Jest", "Cypress"] },
];

export const achievements = [
  { value: "2018", label: "LeetCode rating", sub: "Knight", href: "https://leetcode.com/rajatjc/" },
  { value: "1848", label: "CodeChef rating", sub: "4 star", href: "https://www.codechef.com/users/eobardthawne" },
  { value: "1676", label: "HackerEarth rating", sub: "", href: "https://www.hackerearth.com/@joeyandchandler" },
  { value: "Top 15%", label: "Golden Key Scholar", sub: "Concordia", href: "" },
];
