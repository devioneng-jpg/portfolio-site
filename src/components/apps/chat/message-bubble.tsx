"use client";

import type { UIMessage } from "ai";
import { Bot, User, ArrowRight, Calendar } from "lucide-react";
import { useTabStore, type TabId } from "@/stores/tab-store";
import { ProjectCardsInline } from "./tool-renderers/project-cards-inline";
import { SkillBadgesInline } from "./tool-renderers/skill-badges-inline";
import { ExperienceInline } from "./tool-renderers/experience-inline";
import { TraceStrip } from "./trace-strip";

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
    case "bookMeeting": {
      const meeting = output as { url: string; label: string };
      return (
        <div
          key={index}
          className="bg-primary/5 rounded-lg p-3 border border-primary/15"
        >
          <a
            href={meeting.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {meeting.label}
          </a>
        </div>
      );
    }
    case "switchToContact":
    case "switchToResume": {
      const result = output as { tab?: string; label?: string } | null;
      return (
        <TabSwitchButton
          key={index}
          tab={result?.tab as TabId | undefined}
          label={result?.label ?? toolName}
        />
      );
    }
    default:
      return null;
  }
}

function TabSwitchButton({ tab, label }: { tab?: TabId; label: string }) {
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  return (
    <button
      onClick={() => tab && setActiveTab(tab)}
      className="flex items-center gap-2 text-[11px] text-primary/70 bg-primary/5 rounded-lg px-3 py-2 border border-primary/15 hover:bg-primary/10 transition-colors cursor-pointer"
    >
      <ArrowRight className="w-3 h-3" />
      <span>Go to {label}</span>
    </button>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Extract trace data from data parts
  const tracePart = !isUser
    ? message.parts.find(
        (p) => (p as { type: string }).type === "data-trace"
      )
    : null;
  const traceData = tracePart
    ? (tracePart as { type: string; data: Record<string, unknown> }).data
    : null;

  // Collect tool call names for the trace strip
  const toolCalls = !isUser
    ? message.parts
        .filter(
          (p) =>
            p.type.startsWith("tool-") || p.type === "dynamic-tool"
        )
        .map((p) => {
          if (p.type === "dynamic-tool") {
            return (p as { toolName: string }).toolName;
          }
          return p.type.slice(5);
        })
    : [];

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

          if (part.type === "data-trace") {
            return null; // rendered separately below
          }

          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            return renderToolPart(part, i);
          }

          return null;
        })}

        {traceData && (
          <TraceStrip
            data={{
              inputTokens: traceData.inputTokens as number,
              outputTokens: traceData.outputTokens as number,
              latencyMs: traceData.latencyMs as number,
              cost: traceData.cost as number,
              model: traceData.model as string,
              traceUrl: traceData.traceUrl as string | undefined,
              toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
            }}
          />
        )}
      </div>
    </div>
  );
}
