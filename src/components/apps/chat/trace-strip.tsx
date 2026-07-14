"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

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

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? "Hide AI response trace" : "Show AI response trace"}
        className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        <span>trace</span>
      </button>

      {expanded && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/70 bg-muted/30 rounded px-3 py-1.5 mt-0.5">
          {data.toolCalls && data.toolCalls.length > 0 && (
            <span className="flex items-center gap-1">
              {data.toolCalls.map((tc, i) => (
                <span
                  key={i}
                  className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-mono"
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

          {data.traceUrl && (
            <a
              href={data.traceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-primary/60 hover:text-primary transition-colors"
            >
              View trace
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
