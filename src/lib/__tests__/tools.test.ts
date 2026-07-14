import { describe, it, expect } from "vitest";
import type { Tool } from "ai";
import {
  showProjects,
  showSkills,
  showExperience,
  showAbout,
  bookMeeting,
  switchToProjects,
  switchToContact,
  switchToResume,
} from "@/lib/tools";
import { projects } from "@/lib/data/projects";

async function executeTool<INPUT, OUTPUT>(
  configuredTool: Tool<INPUT, OUTPUT>,
  input: INPUT,
  toolCallId: string
): Promise<OUTPUT> {
  if (!configuredTool.execute) {
    throw new Error("Expected tool to have an execute function");
  }

  const result = await configuredTool.execute(input, {
    toolCallId,
    messages: [],
    abortSignal: undefined as never,
  });

  if (
    typeof result === "object" &&
    result !== null &&
    Symbol.asyncIterator in result
  ) {
    throw new Error("Expected a non-streaming tool result");
  }

  return result;
}

describe("showProjects", () => {
  it("returns all projects when featured is not set", async () => {
    const result = await executeTool(showProjects, { featured: undefined }, "t1");
    expect(result).toEqual(projects);
  });

  it("returns only featured projects when featured is true", async () => {
    const result = await executeTool(showProjects, { featured: true }, "t2");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p: { featured: boolean }) => p.featured)).toBe(true);
  });
});

describe("showSkills", () => {
  it("returns skill categories array", async () => {
    const result = await executeTool(showSkills, {}, "t3");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("showExperience", () => {
  it("returns experiences array", async () => {
    const result = await executeTool(showExperience, {}, "t4");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("showAbout", () => {
  it("returns object with name, title, location", async () => {
    const result = await executeTool(showAbout, {}, "t5");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("location");
  });
});

describe("bookMeeting", () => {
  it("returns the Cal.com profile with no params", async () => {
    const result = await executeTool(bookMeeting, {}, "t6");
    expect(result.url).toBe("https://cal.com/dtharpe");
    expect(result.label).toContain("15- or 30-minute");
  });

  it("includes name and email params", async () => {
    const result = await executeTool(
      bookMeeting,
      { name: "Jane", email: "jane@test.com" },
      "t7"
    );
    expect(result.url).toContain("name=Jane");
    expect(result.url).toContain("email=jane%40test.com");
  });
});

describe("switchToContact", () => {
  it("returns correct tab and label", async () => {
    const result = await executeTool(switchToContact, {}, "t8");
    expect(result).toEqual({ tab: "contact", label: "Contact" });
  });
});

describe("switchToProjects", () => {
  it("returns correct tab and label", async () => {
    const result = await executeTool(switchToProjects, {}, "t9");
    expect(result).toEqual({ tab: "projects", label: "Projects" });
  });
});

describe("switchToResume", () => {
  it("returns correct tab and label", async () => {
    const result = await executeTool(switchToResume, {}, "t10");
    expect(result).toEqual({ tab: "resume", label: "Resume" });
  });
});
