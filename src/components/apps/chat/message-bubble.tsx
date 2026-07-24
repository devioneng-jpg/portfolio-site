"use client";

import { Bot, User, ArrowRight, Calendar } from "lucide-react";
import { useTabStore, type TabId } from "@/stores/tab-store";
import type { PortfolioMessage } from "@/lib/chat-types";
import { ProjectCardsInline } from "./tool-renderers/project-cards-inline";
import { SkillBadgesInline } from "./tool-renderers/skill-badges-inline";
import { ExperienceInline } from "./tool-renderers/experience-inline";
import { TraceStrip } from "./trace-strip";
import { sanitizeExternalUrl } from "@/lib/safe-url";

interface MessageBubbleProps {
  message: PortfolioMessage;
}

function renderToolPart(part: PortfolioMessage["parts"][number], index: number) {
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
          className="border border-border bg-card p-4 text-sm text-foreground/80"
        >
          <p className="mb-1 text-sm font-bold text-foreground">{about.name}</p>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
            {about.title} &middot; {about.location}
          </p>
          <p className="text-xs leading-relaxed">{about.bio}</p>
        </div>
      );
    }
    case "bookMeeting": {
      const meeting = output as { url: string; label: string };
      const meetingUrl = sanitizeExternalUrl(meeting.url, {
        allowedHosts: ["cal.com"],
      });
      if (!meetingUrl) return null;

      return (
        <div
          key={index}
          className="border border-primary/40 bg-primary/5 p-4"
        >
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary/80"
          >
            <Calendar className="size-4" aria-hidden="true" />
            {meeting.label}
          </a>
        </div>
      );
    }
    case "switchToProjects":
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
      type="button"
      className="flex cursor-pointer items-center gap-2 border border-primary/40 bg-primary/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowRight className="size-3" aria-hidden="true" />
      <span>Go to {label}</span>
    </button>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const showTrace = process.env.NEXT_PUBLIC_SHOW_AI_TRACE === "true";

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
        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center border ${
          isUser ? "border-primary/30 bg-primary/15" : "border-border bg-card"
        }`}
      >
        {isUser ? (
          <User className="size-3.5 text-primary" aria-hidden="true" />
        ) : (
          <Bot className="size-3.5 text-foreground/70" aria-hidden="true" />
        )}
      </div>

      <div
        className={`max-w-[88%] space-y-2 sm:max-w-[78%] ${
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
                    ? "border border-primary/40 bg-primary/10 px-4 py-3 text-foreground"
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

        {showTrace && traceData && (
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
