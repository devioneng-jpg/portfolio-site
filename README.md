# Devion's AI Twin | Devion Tharpe's Portfolio

A personal portfolio for **Devion Tharpe** (Senior Solutions Engineer, Twilio)
with tab-based experiences. The centerpiece is **Devion's AI Twin**,
an AI assistant that knows Devion's background and can answer questions,
render structured results inline, or offer navigation to detailed case studies,
resume, and contact views, including a LiveKit-powered voice mode.

## Apps

| Tab | Description |
|-----|-------------|
| **Resume** | Formal resume view (`components/apps/resume`) |
| **Projects** | Solutions Engineering case studies sourced from public work (`components/apps/projects`) |
| **Chat** | Streaming AI chat with tool calls + voice mode (`components/apps/chat`) |
| **Contact** | Social, email, and Cal.com links (`components/apps/contact`) |

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`, shadcn-style primitives
  (Base UI + CVA + `tailwind-merge`)
- **State**: Zustand (active-tab store)
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) with
  Anthropic Claude; tool calls drive inline UI and tab switching
- **Voice**: LiveKit (`livekit-client`, `@livekit/components-react`,
  `livekit-server-sdk`)
- **Observability**: Langfuse via OpenTelemetry (`@langfuse/otel`) :  traces
  every LLM call with token usage & latency
- **Validation**: Zod 4

## Getting started

Requires **Node 20+** and **pnpm**.

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` in the repo root:

```bash
# Required for /api/chat
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Required in production for shared API rate limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
RATE_LIMIT_SALT=...

# Public deployment URL
APP_URL=https://your-domain.example

# Optional :  Langfuse tracing (works without, just no observability)
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASEURL=https://cloud.langfuse.com
LANGFUSE_PROJECT_ID=...          # used to build trace URLs in the UI
NEXT_PUBLIC_SHOW_AI_TRACE=false  # opt-in response diagnostics

# Required for voice mode (/api/voice-token + browser client)
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_AGENT_NAME=your-deployed-agent
```

The chat tab works without LiveKit; voice mode requires all four LiveKit
variables.

## Scripts

```bash
pnpm dev          # next dev
pnpm build        # next build
pnpm start        # next start (after build)
pnpm lint         # eslint
pnpm test         # vitest (run once)
pnpm test:watch   # vitest in watch mode
pnpm test:e2e     # Playwright desktop + mobile smoke tests
```

## Testing

Tests use [Vitest](https://vitest.dev/) and live alongside source code in
`__tests__/` directories:

- `src/lib/__tests__/tools.test.ts` :  tool execute functions (projects,
  skills, experience, about, bookMeeting, tab-switch)
- `src/app/api/chat/__tests__/route.test.ts` :  rate limiter logic and cost
  estimation plus chat request validation
- `src/app/api/voice-token/__tests__/route.test.ts` :  voice configuration,
  short-lived room issuance, and abuse limits
- `tests/e2e/portfolio.spec.ts` :  desktop/mobile navigation and keyboard smoke
  coverage

Run `pnpm test` for unit/integration coverage. Install Chromium once with
`pnpm test:e2e:install`, then run `pnpm test:e2e`. GitHub Actions runs lint,
tests, production build, and browser smoke coverage for pull requests.

## Project layout

```
src/
  app/
    layout.tsx, page.tsx, globals.css
    api/
      chat/route.ts          # streaming chat endpoint (Anthropic + tools)
      voice-token/route.ts   # LiveKit access token
  components/
    layout/                  # shell, nav-bar
    ui/                      # shadcn primitives (button, card, …)
    apps/
      chat/                  # chat UI, voice, tool renderers
      projects/              # project gallery + cards
      resume/                # resume app
      contact/               # contact app
  lib/
    tools.ts                 # AI SDK tool definitions
    utils.ts                 # cn(), helpers
    data/                    # static content: skills, projects, experience, social-links
  stores/
    tab-store.ts             # Zustand store for the active tab
public/                      # static assets
```

Path alias: `@/*` → `src/*`.

## Editing content

Portfolio content lives in `src/lib/data/`:

- `projects.ts` :  project gallery entries
- `experience.ts` :  work history / timeline
- `skills.ts` :  tech stack
- `social-links.ts` :  contact + social URLs

Edit there, not inline in components.

## How Dev-GPT works

`/api/chat` streams from Anthropic via the Vercel AI SDK. The model is givena system prompt describing Devion plus a set of tools defined in `src/lib/tools.ts`:

- **Inline tools** (`showProjects`, `showSkills`, `showExperience`,
  `showAbout`) render structured cards directly in the chat thread via
  renderers in `components/apps/chat/tool-renderers/`.
- **Tab-switching tools** (`switchToProjects`, `switchToContact`,
  `switchToResume`) render a
  clickable "Go to X" button inline so users navigate on their own terms.

A shared Upstash-backed rate limiter caps chat usage at ~30 requests/hour per visitor. Local development uses an in-memory fallback; production fails closedwhen durable limiting is not configured.

## Deployment

Designed to deploy cleanly to Vercel. Set the environment variables above inthe project's dashboard, then push to your default branch. For voice mode,provision a LiveKit Cloud project and copy the credentials.

## License

Personal portfolio :  no license granted for reuse of the content
(copy, bio, project descriptions, branding). The scaffolding code is fine
to learn from.
