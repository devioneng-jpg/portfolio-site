import { z } from "zod";
import { tool } from "ai";
import { projects } from "./data/projects";
import { skillCategories } from "./data/skills";
import { experiences } from "./data/experience";
import { aboutMe } from "./data/social-links";

// Inline tools — render components inside chat
export const showProjects = tool({
  description:
    "Show a compact horizontal scroll of project cards inline in the chat. Use when user asks about projects, portfolio, or what you've built.",
  inputSchema: z.object({
    featured: z
      .boolean()
      .optional()
      .describe("If true, only show featured projects"),
  }),
  execute: async ({ featured }) => {
    if (featured) {
      return projects.filter((p) => p.featured);
    }
    return projects;
  },
});

export const showSkills = tool({
  description:
    "Show tech skills as categorized badge groups inline in chat. Use when user asks about skills, technologies, or tech stack.",
  inputSchema: z.object({}),
  execute: async () => {
    return skillCategories;
  },
});

export const showExperience = tool({
  description:
    "Show work experience as a compact timeline inline in chat. Use when user asks about experience, work history, or career.",
  inputSchema: z.object({}),
  execute: async () => {
    return experiences;
  },
});

export const showAbout = tool({
  description:
    "Show a bio card with basic info inline in chat. Use when user asks who you are, about yourself, or for an introduction.",
  inputSchema: z.object({}),
  execute: async () => {
    return aboutMe;
  },
});

// Tab-switching tools — navigate to different sections
export const switchToProjects = tool({
  description:
    "Switch to the Projects tab to show the full project gallery. Use when user wants to browse all projects in detail or says 'show me everything'.",
  inputSchema: z.object({}),
  execute: async () => {
    return { tab: "projects", label: "Projects" };
  },
});

export const switchToContact = tool({
  description:
    "Switch to the Contact tab with social links and email. Use when user asks how to reach you, contact info, or wants to connect.",
  inputSchema: z.object({}),
  execute: async () => {
    return { tab: "contact", label: "Contact" };
  },
});

export const switchToResume = tool({
  description:
    "Switch to the Resume tab. Use when user asks for a resume, CV, or formal overview of qualifications.",
  inputSchema: z.object({}),
  execute: async () => {
    return { tab: "resume", label: "Resume" };
  },
});

export const allTools = {
  showProjects,
  showSkills,
  showExperience,
  showAbout,
  switchToProjects,
  switchToContact,
  switchToResume,
};
