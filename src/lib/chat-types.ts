import type { InferUITools, UIMessage } from "ai";
import type { allTools } from "./tools";

export interface TraceData {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cost: number;
  model: string;
  traceUrl?: string;
}

export type PortfolioMessage = UIMessage<
  unknown,
  { trace: TraceData },
  InferUITools<typeof allTools>
>;
