import { z } from "zod";
import { tool } from "ai";
import { projects } from "./data/projects";
import { skillCategories } from "./data/skills";
import { experiences } from "./data/experience";
import { aboutMe } from "./data/social-links";
import { createBookingUrl } from "./booking";

// Inline tools: render components inside chat
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

// Tab-switching tools: navigate to different sections
export const switchToContact = tool({
  description:
    "Switch to the Contact tab with social links and email. Use when user asks how to reach you, contact info, or wants to connect.",
  inputSchema: z.object({}),
  execute: async () => {
    return { tab: "contact", label: "Contact" };
  },
});

export const switchToProjects = tool({
  description:
    "Offer a button to open the Projects tab for detailed Solutions Engineering case studies. Use when the user wants to explore project architecture, customer problems, business value, or production considerations.",
  inputSchema: z.object({}),
  execute: async () => {
    return { tab: "projects", label: "Projects" };
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

export const bookMeeting = tool({
  description:
    "Show Devion's Cal.com booking link so the user can choose a 15- or 30-minute meeting. Use when the user wants to book a call, schedule a meeting, chat live, or connect. Pass a name or email when provided to pre-fill the booking form.",
  inputSchema: z.object({
    name: z.string().optional().describe("User's full name if provided"),
    email: z.email().optional().describe("User's email if provided"),
  }),
  execute: async ({ name, email }) => {
    return {
      url: createBookingUrl({ name, email }),
      label: "Choose a 15- or 30-minute meeting with Devion",
    };
  },
});

export const allTools = {
  showProjects,
  showSkills,
  showExperience,
  showAbout,
  bookMeeting,
  switchToProjects,
  switchToContact,
  switchToResume,
};
