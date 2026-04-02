"use client";

import type { UIMessage } from "ai";
import { Bot, User, ArrowRight } from "lucide-react";
import { ProjectCardsInline } from "./tool-renderers/project-cards-inline";
import { SkillBadgesInline } from "./tool-renderers/skill-badges-inline";
import { ExperienceInline } from "./tool-renderers/experience-inline";

interface MessageBubbleProps {
  message: UIMessage;
}

function renderToolPart(part: UIMessage["parts"][number], index: number) {
  const toolType = part.type;

  let toolName: string;
  let state: string;
  let output: unknown;

  if (toolType === "dynamic-tool") {
    const dynamicPart = part as { toolName: string; state: string; output?: unknown };
    toolName = dynamicPart.toolName;
    state = dynamicPart.state;
    output = dynamicPart.output;
  } else if (toolType.startsWith("tool-")) {
    toolName = toolType.slice(5);
    const toolPart = part as { state: string; output?: unknown };
    state = toolPart.state;
    output = toolPart.output;
  } else {
    return null;
  }

  if (state !== "output-available") return null;

  switch (toolName) {
    case "showProjects":
      return <ProjectCardsInline key={index} projects={output as never} />;
    case "showSkills":
      return <SkillBadgesInline key={index} categories={output as never} />;
    case "showExperience":
      return <ExperienceInline key={index} experiences={output as never} />;
    case "showAbout": {
      const about = output as {
        name: string;
        title: string;
        location: string;
        bio: string;
      };
      return (
        <div
          key={index}
          className="bg-muted/50 rounded-lg p-3 text-sm text-foreground/80 border border-border"
        >
          <p className="font-medium text-foreground/90 mb-1">{about.name}</p>
          <p className="text-xs text-muted-foreground mb-2">
            {about.title} &middot; {about.location}
          </p>
          <p className="text-xs leading-relaxed">{about.bio}</p>
        </div>
      );
    }
    case "switchToProjects":
    case "switchToContact":
    case "switchToResume": {
      const result = output as { tab?: string; label?: string } | null;
      return (
        <div
          key={index}
          className="flex items-center gap-2 text-[11px] text-primary/70 bg-primary/5 rounded-lg px-3 py-2 border border-primary/15"
        >
          <ArrowRight className="w-3 h-3" />
          <span>Switched to {result?.label ?? toolName}</span>
        </div>
      );
    }
    default:
      return null;
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-2 items-start ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser ? "bg-primary/20" : "bg-muted"
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-foreground/70" />
        )}
      </div>

      <div
        className={`max-w-[85%] space-y-2 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div
                key={i}
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-primary/20 text-foreground px-3 py-2 rounded-2xl rounded-tr-md"
                    : "text-foreground/90"
                }`}
              >
                {part.text}
              </div>
            );
          }

          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            return renderToolPart(part, i);
          }

          return null;
        })}
      </div>
    </div>
  );
}
