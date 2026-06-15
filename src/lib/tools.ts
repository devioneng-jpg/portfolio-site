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

export const bookMeeting = tool({
  description:
    "Show a Calendly booking link so the user can schedule a meeting with Devion. Use when user wants to book a call, schedule a meeting, chat live, or connect. Pass any details the user provides (name, email, date/time) to pre-fill the booking form. For date_time, convert the user's request to ISO 8601 format (e.g. '2026-06-17T15:30:00').",
  inputSchema: z.object({
    name: z.string().optional().describe("User's full name if provided"),
    email: z.string().optional().describe("User's email if provided"),
    date_time: z
      .string()
      .optional()
      .describe(
        "Requested date/time in ISO 8601 format (e.g. 2026-06-17T15:30:00)"
      ),
  }),
  execute: async ({ name, email, date_time }) => {
    const base = "https://calendly.com/tharpedevion/30min";
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (email) params.set("email", email);
    if (date_time) {
      const d = new Date(date_time);
      params.set("month", `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      params.set("date", date_time.split("T")[0]);
    }
    const query = params.toString();
    const url = query ? `${base}?${query}` : base;
    return {
      url,
      label: date_time
        ? `Book a 30-min meeting with Devion — click to confirm`
        : "Book a 30-min meeting with Devion",
    };
  },
});

export const allTools = {
  showProjects,
  showSkills,
  showExperience,
  showAbout,
  bookMeeting,
  switchToContact,
  switchToResume,
};
