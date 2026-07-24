"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { sanitizeExternalUrl } from "@/lib/safe-url";

interface TraceData {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cost: number;
  model: string;
  traceUrl?: string;
  toolCalls?: string[];
}

export function TraceStrip({ data }: { data: TraceData }) {
  const [expanded, setExpanded] = useState(false);

  const modelShort = data.model
    .replace("claude-", "")
    .replace("-20250514", "");
  const traceUrl = sanitizeExternalUrl(data.traceUrl, {
    allowedHosts: ["langfuse.com"],
  });

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? "Hide AI response trace" : "Show AI response trace"}
        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {expanded ? (
          <ChevronDown className="size-3" aria-hidden="true" />
        ) : (
          <ChevronRight className="size-3" aria-hidden="true" />
        )}
        <span>Response trace</span>
      </button>

      {expanded && (
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 border border-border bg-card px-3 py-2 text-[10px] text-muted-foreground">
          {data.toolCalls && data.toolCalls.length > 0 && (
            <span className="flex items-center gap-1">
              {data.toolCalls.map((tc, i) => (
                <span
                  key={i}
                  className="border border-border bg-background px-1.5 py-0.5 font-mono text-[9px]"
                >
                  {tc}
                </span>
              ))}
            </span>
          )}

          <span>{data.latencyMs.toLocaleString()}ms</span>

          <span>
            {data.inputTokens} in / {data.outputTokens} out
          </span>

          <span>${data.cost.toFixed(4)}</span>

          <span className="font-mono">{modelShort}</span>

          {traceUrl && (
            <a
              href={traceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View trace
              <ExternalLink className="size-2.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
