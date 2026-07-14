export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  businessValue: string;
  architecture: string[];
  productionConsiderations: string[];
  tech: string[];
  github?: string;
  live?: string;
  status: "Production-minded MVP" | "Working prototype" | "In development";
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "asterly",
    title: "Asterly Support Intelligence Agent",
    description:
      "A grounded B2B support agent that turns customer issues into policy-aware responses or traceable escalations.",
    problem:
      "Support teams lose time when agents lack issue context, approved product guidance, and consistent escalation rules.",
    solution:
      "Asterly extracts validated case facts with an LLM, then keeps classification, severity, routing, retrieval, and escalation inside deterministic Python policy code.",
    businessValue:
      "Demonstrates how an SE can pair conversational AI with auditable controls to improve response consistency without handing business-critical decisions to the model.",
    architecture: [
      "Next.js streaming chat through Vercel AI Gateway",
      "FastAPI coordinator with deterministic policy and retrieval",
      "Upstash-backed session and IP protection",
      "Braintrust tracing plus deterministic and model-quality evals",
    ],
    productionConsiderations: [
      "Human review for sensitive or high-risk support cases",
      "Tenant-isolated retrieval and verified customer identity",
      "Fail-closed production configuration and concurrency limits",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "Upstash Redis",
      "Braintrust",
      "Vercel AI SDK",
    ],
    github: "https://github.com/devioneng-jpg/asterly",
    status: "Production-minded MVP",
    featured: true,
  },
  {
    id: "ideaops",
    title: "IdeaOps Multi-Agent Planner",
    description:
      "A multi-agent workflow that converts a raw idea into a scored MVP brief, prioritized tasks, and a published Notion plan.",
    problem:
      "Early product ideas are difficult to evaluate consistently and often stall before they become an actionable delivery plan.",
    solution:
      "A deterministic LangGraph supervisor routes work through specialist agents for classification, scoring, planning, and task breakdown, then publishes the result to Notion.",
    businessValue:
      "Shows an end-to-end automation story across web, SMS, AI orchestration, persistence, and a business system teams already use.",
    architecture: [
      "Next.js web form and Twilio SMS entry points",
      "FastAPI API with a deterministic LangGraph supervisor",
      "Structured Claude outputs persisted in Supabase",
      "Non-LLM Notion publisher with partial-success handling",
    ],
    productionConsiderations: [
      "Retries and typed validation at every model boundary",
      "Graceful partial success when downstream publishing fails",
      "Golden-set evaluations separated from mocked unit tests",
    ],
    tech: [
      "LangGraph",
      "Claude",
      "FastAPI",
      "Next.js",
      "Supabase",
      "Twilio",
      "Notion API",
    ],
    github: "https://github.com/devioneng-jpg/ideaops",
    status: "Working prototype",
    featured: true,
  },
  {
    id: "agentic-rag",
    title: "Agentic RAG CLI",
    description:
      "A command-line research assistant that lets Claude choose retrieval tools and answer over local documents with source citations.",
    problem:
      "Teams need fast answers from private document sets, but answers are only useful when users can verify where the information came from.",
    solution:
      "A local agent loop gives Claude purpose-built search, multi-search, and source-listing tools backed by ChromaDB vector retrieval.",
    businessValue:
      "Demonstrates a compact, explainable RAG pattern that can be adapted to discovery workshops and customer knowledge workflows.",
    architecture: [
      "Python CLI for indexing, interactive chat, and one-shot queries",
      "Claude tool-use loop with explicit retrieval operations",
      "Sentence-transformer embeddings and ChromaDB storage",
      "Source-aware synthesis with inline citations",
    ],
    productionConsiderations: [
      "Access controls and tenant isolation for shared deployments",
      "Retrieval evaluation before expanding the corpus",
      "Document lifecycle and embedding-version management",
    ],
    tech: ["Python", "Claude", "ChromaDB", "RAG", "Tool Use", "Embeddings"],
    github: "https://github.com/devioneng-jpg/agentic_rag",
    status: "Working prototype",
    featured: true,
  },
  {
    id: "document-copilot",
    title: "Document Copilot",
    description:
      "A sourced research assistant designed to help financial analysts query filings and move from document intake to analysis.",
    problem:
      "Analysts spend substantial time reading large 10-K and 10-Q corpora before they can begin higher-value research.",
    solution:
      "A FastAPI and React application combines authenticated document workflows with hybrid Postgres retrieval and citable LLM answers.",
    businessValue:
      "Frames AI around a concrete analyst workflow and shows how retrieval, identity, citations, and deployment fit into an enterprise solution.",
    architecture: [
      "FastAPI backend and typed React client",
      "Supabase Auth, Postgres, full-text search, and pgvector",
      "SQLAlchemy models with Alembic migrations",
      "OpenAI generation and embeddings with Railway hosting",
    ],
    productionConsiderations: [
      "Permission-scoped retrieval for confidential research",
      "Citation quality and retrieval evaluation",
      "Data retention and SEC ingestion reliability",
    ],
    tech: [
      "FastAPI",
      "React",
      "TypeScript",
      "Supabase",
      "pgvector",
      "OpenAI",
      "Railway",
    ],
    github: "https://github.com/devioneng-jpg/document-copilot",
    status: "In development",
    featured: false,
  },
  {
    id: "devions-ai-twin",
    title: "Devion's AI Twin Portfolio",
    description:
      "An interactive portfolio that lets visitors explore experience, skills, projects, and availability through text or voice.",
    problem:
      "Traditional portfolios make recruiters and customers search through static pages instead of letting them ask the questions that matter to them.",
    solution:
      "A tool-using Claude assistant streams concise answers, renders structured portfolio data inline, and routes visitors into deeper resume, project, and contact views.",
    businessValue:
      "Turns a personal portfolio into a live Solutions Engineering demonstration covering discovery, AI UX, observability, voice, and conversion.",
    architecture: [
      "Next.js App Router with a Zustand tab shell",
      "Vercel AI SDK streaming and typed portfolio tools",
      "LiveKit voice sessions with a separately deployed agent",
      "OpenTelemetry and Langfuse observability",
    ],
    productionConsiderations: [
      "Durable abuse protection for public AI endpoints",
      "Accessible fallbacks when voice services are unavailable",
      "Content accuracy and clear separation of verified facts",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vercel AI SDK",
      "Claude",
      "LiveKit",
      "Langfuse",
    ],
    github: "https://github.com/devioneng-jpg/portfolio-site",
    status: "Production-minded MVP",
    featured: true,
  },
];
