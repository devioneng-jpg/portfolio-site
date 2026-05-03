export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  live?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "dev-gpt",
    title: "Devion's AI Twin Portfolio",
    description:
      "An AI-powered portfolio site with a conversational interface. Chat with an AI that knows everything about my career and work.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel AI SDK", "Claude"],
    featured: true,
  },
];
