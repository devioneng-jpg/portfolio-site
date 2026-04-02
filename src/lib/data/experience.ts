export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Solutions Engineer",
    company: "Twilio",
    period: "Dec 2024 – Present",
    description:
      "Supporting enterprise and commercial accounts with complex multi-system integrations across voice, messaging, and digital channels.",
    highlights: [
      "Supported $830K in influenced ARR with an average deal size of ~$75K",
      "Engineered customer-facing AI agent prototypes in TypeScript and Python across POCs and technical workshops",
      "Architected hybrid data & connectivity solutions using Twilio APIs across voice, messaging, and digital channels",
    ],
    tech: ["TypeScript", "Python", "Twilio APIs", "AI Agents"],
  },
  {
    id: "exp-2",
    role: "Technical PMM, Senior (Contract)",
    company: "Gravitee",
    period: "Mar 2024 – Oct 2024",
    description:
      "Enhanced positioning and messaging strategies for API management and event streaming products.",
    highlights: [
      "Achieved 40% increase in product differentiation for API/Kafka Gateway, Developer Portal, and Access Management tools",
      "Developed and delivered demos, webinars, and live workshops driving 30% increase in customer engagement",
    ],
    tech: ["API Management", "Apache Kafka", "Developer Portal"],
  },
  {
    id: "exp-3",
    role: "Solution Architect, Pre-Sales",
    company: "Ketch Inc.",
    period: "Aug 2023 – Feb 2024",
    description:
      "Served as technical liaison for Enterprise AEs and Customer Success teams, facilitating product demos and proof of concept sessions.",
    highlights: [
      "Contributed to a 60% increase in deal closures through product demonstrations and POC sessions",
      "Increased average deal size by 65%, from $29K to $48K",
    ],
    tech: ["Privacy Tech", "Enterprise Sales", "POC Delivery"],
  },
  {
    id: "exp-4",
    role: "Solutions Engineer",
    company: "Gravitee",
    period: "Jun 2022 – Aug 2023",
    description:
      "Created and implemented technical solutions for enterprise clients around API gateway design, policy configuration, and deployment.",
    highlights: [
      "Generated an additional $925K in annual revenue by securing new Enterprise clients",
      "Led end-to-end Gravitee.io POCs for enterprise accounts",
      "Increased ACV by 127%, from $30K to $68K, through closed-won deals",
    ],
    tech: ["API Gateway", "Gravitee.io", "Kubernetes", "Docker"],
  },
  {
    id: "exp-5",
    role: "Solutions Engineer",
    company: "Showpad",
    period: "Apr 2021 – Jun 2022",
    description:
      "Delivered technical pre-sales support for sales enablement platform.",
    highlights: [],
    tech: ["Sales Enablement", "SaaS"],
  },
  {
    id: "exp-6",
    role: "Solution Architect",
    company: "Tricentis",
    period: "Aug 2019 – Apr 2021",
    description:
      "Provided technical solution architecture for enterprise testing and QA platform.",
    highlights: [],
    tech: ["Test Automation", "Enterprise Software"],
  },
];
