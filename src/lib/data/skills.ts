export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "AI & LLM",
    skills: [
      "LLM",
      "RAG",
      "Model Context Protocol (MCP)",
      "Vector Databases",
      "AI Agents",
    ],
  },
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    category: "Cloud & Infrastructure",
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux"],
  },
  {
    category: "Backend & Data",
    skills: ["Node.js", "Apache Kafka", "API Management"],
  },
];

export const allSkills = skillCategories.flatMap((c) => c.skills);
