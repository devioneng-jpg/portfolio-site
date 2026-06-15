import { describe, it, expect } from "vitest";
import {
  showProjects,
  showSkills,
  showExperience,
  showAbout,
  bookMeeting,
  switchToContact,
  switchToResume,
} from "@/lib/tools";
import { projects } from "@/lib/data/projects";

describe("showProjects", () => {
  it("returns all projects when featured is not set", async () => {
    const result = await showProjects.execute({ featured: undefined }, { toolCallId: "t1", messages: [], abortSignal: undefined as never });
    expect(result).toEqual(projects);
  });

  it("returns only featured projects when featured is true", async () => {
    const result = await showProjects.execute({ featured: true }, { toolCallId: "t2", messages: [], abortSignal: undefined as never });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p: { featured: boolean }) => p.featured)).toBe(true);
  });
});

describe("showSkills", () => {
  it("returns skill categories array", async () => {
    const result = await showSkills.execute({}, { toolCallId: "t3", messages: [], abortSignal: undefined as never });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("showExperience", () => {
  it("returns experiences array", async () => {
    const result = await showExperience.execute({}, { toolCallId: "t4", messages: [], abortSignal: undefined as never });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("showAbout", () => {
  it("returns object with name, title, location", async () => {
    const result = await showAbout.execute({}, { toolCallId: "t5", messages: [], abortSignal: undefined as never });
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("location");
  });
});

describe("bookMeeting", () => {
  it("returns base Calendly URL with no params", async () => {
    const result = await bookMeeting.execute({}, { toolCallId: "t6", messages: [], abortSignal: undefined as never });
    expect(result.url).toBe("https://calendly.com/tharpedevion/30min");
    expect(result.label).toContain("Book a 30-min meeting");
  });

  it("includes name and email params", async () => {
    const result = await bookMeeting.execute(
      { name: "Jane", email: "jane@test.com" },
      { toolCallId: "t7", messages: [], abortSignal: undefined as never }
    );
    expect(result.url).toContain("name=Jane");
    expect(result.url).toContain("email=jane%40test.com");
  });

  it("includes date params when date_time provided", async () => {
    const result = await bookMeeting.execute(
      { date_time: "2026-06-17T15:30:00" },
      { toolCallId: "t8", messages: [], abortSignal: undefined as never }
    );
    expect(result.url).toContain("month=2026-06");
    expect(result.url).toContain("date=2026-06-17");
    expect(result.label).toContain("click to confirm");
  });
});

describe("switchToContact", () => {
  it("returns correct tab and label", async () => {
    const result = await switchToContact.execute({}, { toolCallId: "t9", messages: [], abortSignal: undefined as never });
    expect(result).toEqual({ tab: "contact", label: "Contact" });
  });
});

describe("switchToResume", () => {
  it("returns correct tab and label", async () => {
    const result = await switchToResume.execute({}, { toolCallId: "t10", messages: [], abortSignal: undefined as never });
    expect(result).toEqual({ tab: "resume", label: "Resume" });
  });
});
