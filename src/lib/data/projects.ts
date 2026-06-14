export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  benefit?: string;
  tech: string[];
  github?: string;
  live?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "devions-ai-twin",
    title: "Devion's AI Twin Portfolio",
    description:
      "An AI-powered portfolio site with a conversational interface. Chat with an AI that knows everything about my career and work.",
    longDescription:
      "A portfolio reimagined as an OS-style desktop with tab-based apps. The centerpiece is an AI twin that streams answers about my background and renders structured results inline — project cards, skill badges, an experience timeline — or switches tabs to a fuller view. It also ships a LiveKit-powered voice mode for talking to the assistant out loud.",
    benefit:
      "Lets visitors explore my experience conversationally instead of scrolling a static page — answering their actual questions in seconds and showcasing hands-on AI engineering at the same time.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel AI SDK", "Claude"],
    featured: true,
  },
];
