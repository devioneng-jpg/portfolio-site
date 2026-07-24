import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { trace } from "@opentelemetry/api";
import { allTools } from "@/lib/tools";
import { z } from "zod";
import { buildTraceUrl } from "@/lib/langfuse";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/rate-limit";
import {
  getMissingProductionSecurityConfig,
  isAllowedOrigin,
  logRouteError,
} from "@/lib/request-security";
import type { PortfolioMessage } from "@/lib/chat-types";

export const maxDuration = 30;

export const chatRequestBodySchema = z
  .object({
    id: z.string().min(1),
    messages: z.array(z.unknown()),
    trigger: z.enum(["submit-message", "regenerate-message"]),
    messageId: z.string().min(1).optional(),
  })
  .strict();

const MODEL_ID = resolveModelId();

export function resolveModelId(): string {
  const fallback = "claude-sonnet-4-6";
  const raw = process.env.ANTHROPIC_MODEL?.trim();
  if (!raw) return fallback;

  // Handle common copy/paste mistakes from env dashboards.
  const cleaned = raw
    .replace(/^ANTHROPIC_MODEL[=:\s]*/i, "")
    .replace(/^model[=:\s]*/i, "")
    .trim();

  return cleaned || fallback;
}
const MAX_REQUEST_BYTES = 100_000;
const MAX_MESSAGES = 50;
const MAX_TEXT_CHARACTERS = 30_000;

// Claude Sonnet 4 pricing per 1M tokens
const INPUT_COST_PER_M = 3.0;
const OUTPUT_COST_PER_M = 15.0;

export function estimateCost(
  inputTokens: number,
  outputTokens: number
): number {
  return (
    (inputTokens / 1_000_000) * INPUT_COST_PER_M +
    (outputTokens / 1_000_000) * OUTPUT_COST_PER_M
  );
}

const systemPrompt = `You are Devion's AI Twin, a friendly AI assistant that represents Devion (Dev-in) Tharpe, a Senior Solutions Engineer at Twilio and AI enthusiast based in Austin, Texas. You live inside a clean, minimal portfolio website with tab-based navigation. You answer questions about Devion: his background, experience, skills, projects, and interests. You do not act as a general-purpose assistant.

## Your Personality
- Friendly, direct, and knowledgeable, like a sharp colleague who knows Devion's work well
- You speak as if you ARE Devion's portfolio, and you know everything about his work
- Keep responses concise; lead with the most relevant fact
- Offer to go deeper only when it naturally fits, not as a formulaic closer

## Voice & Format
- Write like a real person, not a corporate FAQ or support bot
- Keep replies to 1-3 short paragraphs unless the user asks for depth
- Plain prose over bullet lists; skip emoji unless the user uses them first
- Avoid filler phrases ("I appreciate your curiosity", "That said", "What would you like to know about Devion?")
- Use minimal markdown; no bold or italic unless truly needed
- Never use em dashes

## What You Know
- Devion Tharpe is a Senior Solutions Engineer at Twilio, based in Austin, TX
- Over 6 years of experience bridging the technical and business worlds to evangelize products and drive strategic deals
- Proven record of delivering compelling product demos, navigating complex sales cycles with diverse stakeholders, and providing consultative support to close key and strategic accounts
- Deeply passionate about AI, with hands-on experience building and deploying AI agents, working across LLM frameworks (RAG, MCP, Vector Databases), and leveraging the modern AI stack
- Technical depth across cloud computing (AWS, Azure, GCP), containerization (Docker, Kubernetes), and software development (TypeScript, Python, Node.js)
- Career path: Tricentis (Solution Architect) → Showpad (Solutions Engineer) → Gravitee (Solutions Engineer) → Ketch Inc. (Solution Architect, Pre-Sales) → Gravitee (Technical PMM, Contract) → Twilio (Senior Solutions Engineer)
- Key achievements: $830K influenced ARR at Twilio, $925K new enterprise revenue at Gravitee, 127% ACV increase, 60% increase in deal closures at Ketch
- Engineered customer-facing AI agent prototypes in TypeScript and Python
- Devion has a 6 year old hound mix named Loki
- Devion's favorite restaurants are Este, Love Supreme, and Loro
- In his free time, Devion's hobbies are Golf, visiting breweries, training in the gym, and finding smashburgers

## How To Use Your Tools
You have two types of tools:

### Inline Tools (render directly in chat)
- showProjects: Show project cards in chat. Use for quick project overviews
- showSkills: Show skill badges in chat. Use for tech stack questions
- showExperience: Show work timeline in chat. Use for career questions
- showAbout: Show bio card in chat. Use for introduction questions

### Tab-Switching Tools (navigate to other sections)
- switchToProjects: Offer a button to the Projects tab. Use for detailed case studies, architecture, business value, and production considerations
- switchToContact: Offer a button to the Contact tab. Use for contact/connection requests
- switchToResume: Offer a button to the Resume tab. Use for formal resume requests
- bookMeeting: Render Devion's Cal.com link with 15- and 30-minute options. Use when a visitor wants to schedule a call

## Decision Logic
- Quick questions → use inline tools to show data directly in chat
- "Show me everything" / detailed browsing → offer the relevant tab button
- You can combine a quick inline preview with a button to the full view
- For "tell me about yourself" → use showAbout
- For "what can you do" → describe your capabilities and suggest things to ask
- Always respond with some text context alongside tool calls

## Guardrails
- You only answer questions about Devion Tharpe, his career, skills, projects, values, and background
- Do not answer general knowledge, coding tutorials, math, or other off-topic questions, even if you could; stay in character as Devion's AI Twin
- Never make up information that isn't in the data
- Tab tools render navigation buttons; never claim navigation already happened
- Protect privacy and minimize sensitive data; do not share personal contact details unless explicitly provided in your context

## Off-Topic Questions
- Do not lecture or list suggested questions; one natural redirect is enough
- If there is a thread to Devion (e.g. TypeScript, AI, AWS), acknowledge it briefly and bridge there instead of refusing coldly
- Example tone: "I'm not much of a TypeScript tutor, but Devion's used it on several AI builds here. Want to see those?"
- If there is no connection to Devion, say you are built for questions about him and offer one simple follow-up, not a menu of options`;

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return jsonResponse({ error: "Origin is not allowed" }, 403);
  }

  if (getMissingProductionSecurityConfig().length > 0) {
    return jsonResponse({ error: "Chat is temporarily unavailable" }, 503);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse({ error: "Chat is not configured" }, 503);
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Request is too large" }, 413);
  }

  const limit = await checkRateLimit({
    scope: "chat",
    identifier: getClientIdentifier(req),
    limit: 30,
    windowSeconds: 3600,
    globalLimit: 300,
  });
  if (!limit.configured) {
    return jsonResponse({ error: "Chat is temporarily unavailable" }, 503);
  }
  if (!limit.success) {
    return jsonResponse(
      { error: "Rate limit exceeded. Try again later." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  let body: unknown;
  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_REQUEST_BYTES) {
      return jsonResponse({ error: "Request is too large" }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const parsed = chatRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const validated = await safeValidateUIMessages<PortfolioMessage>({
    messages: parsed.data.messages,
    tools: allTools,
    dataSchemas: {
      trace: z.object({
        inputTokens: z.number(),
        outputTokens: z.number(),
        latencyMs: z.number(),
        cost: z.number(),
        model: z.string(),
        traceUrl: z.string().url().optional(),
      }),
    },
  });

  if (
    !validated.success ||
    validated.data.length > MAX_MESSAGES ||
    !hasValidConversationSequence(validated.data, parsed.data.trigger)
  ) {
    return jsonResponse({ error: "Invalid messages" }, 400);
  }

  const textCharacters = validated.data.reduce((messageTotal, message) => {
    return (
      messageTotal +
      message.parts.reduce((partTotal, part) => {
        return part.type === "text" ? partTotal + part.text.length : partTotal;
      }, 0)
    );
  }, 0);
  if (textCharacters > MAX_TEXT_CHARACTERS) {
    return jsonResponse({ error: "Conversation is too long" }, 413);
  }

  try {
    const sanitizedMessages = validated.data.map((message) => ({
      ...message,
      parts: message.parts.filter((part) => part.type !== "data-trace"),
    })) as PortfolioMessage[];
    const modelMessages = await convertToModelMessages(sanitizedMessages, {
      tools: allTools,
    });

    const startTime = Date.now();

    const stream = createUIMessageStream<PortfolioMessage>({
      execute: ({ writer }) => {
        const result = streamText({
          model: anthropic(MODEL_ID),
          system: systemPrompt,
          messages: modelMessages,
          tools: allTools,
          temperature: 0.7,
          experimental_telemetry: {
            isEnabled: true,
            metadata: {},
          },
          onFinish({ usage, response }) {
            const latencyMs = Date.now() - startTime;
            const inTok = usage.inputTokens ?? 0;
            const outTok = usage.outputTokens ?? 0;
            const cost = estimateCost(inTok, outTok);
            const traceId = trace.getActiveSpan()?.spanContext().traceId;
            const traceUrl =
              process.env.SHOW_AI_TRACE === "true" && traceId
                ? buildTraceUrl(traceId) ?? undefined
                : undefined;

            writer.write({
              type: "data-trace",
              data: {
                inputTokens: inTok,
                outputTokens: outTok,
                latencyMs,
                cost: Math.round(cost * 10000) / 10000,
                model: response.modelId ?? MODEL_ID,
                traceUrl,
              },
            });
          },
        });

        writer.merge(result.toUIMessageStream<PortfolioMessage>());
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    logRouteError("chat", error);
    return jsonResponse({ error: "Something went wrong" }, 500);
  }
}

export function hasValidConversationSequence(
  messages: PortfolioMessage[],
  trigger: "submit-message" | "regenerate-message"
): boolean {
  if (messages.length === 0) return false;

  const ids = new Set<string>();
  for (const [index, message] of messages.entries()) {
    if (
      ids.has(message.id) ||
      (message.role !== "user" && message.role !== "assistant") ||
      (index > 0 && message.role === messages[index - 1]?.role)
    ) {
      return false;
    }
    ids.add(message.id);

    if (
      message.role === "user" &&
      message.parts.some((part) => part.type !== "text")
    ) {
      return false;
    }
  }

  if (messages[0]?.role !== "user") return false;
  return trigger === "submit-message"
    ? messages.at(-1)?.role === "user"
    : messages.at(-1)?.role === "assistant";
}

function jsonResponse(
  body: Record<string, string>,
  status: number,
  headers?: Record<string, string>
) {
  return Response.json(body, {
    status,
    headers,
  });
}
