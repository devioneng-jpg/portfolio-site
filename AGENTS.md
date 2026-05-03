<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guidance for AI coding agents working in this repo. Humans welcome too.

## What this project is

A personal portfolio for **Devion Tharpe** styled as an OS/desktop with
tab-based "apps." An AI assistant ("Dev-GPT") answers questions about Devion
and can render structured results inline or switch tabs.

Apps:
- **Resume** — formal resume view (`components/apps/resume`)
- **Projects** — project gallery (`components/apps/projects`)
- **Chat** — streaming AI chat with tool calls + LiveKit voice mode
  (`components/apps/chat`)
- **Contact** — contact form / links (`components/apps/contact`)

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`, shadcn-style primitives in
  `components/ui` (Base UI + CVA + `tailwind-merge`)
- **State**: Zustand (`src/stores/tab-store.ts`) for active-tab state
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) with
  Anthropic Claude as the model; tool calls defined in `src/lib/tools.ts`
- **Voice**: LiveKit (`livekit-client`, `@livekit/components-react`,
  `livekit-server-sdk`)
- **Validation**: Zod 4
- **Animation**: Motion (Framer Motion successor)
- **Windows**: `react-rnd` for draggable/resizable surfaces

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
    tools.ts                 # AI SDK tool definitions (inline + tab-switch)
    utils.ts                 # cn(), helpers
    data/                    # static content: skills, projects, experience, social-links
  stores/
    tab-store.ts             # Zustand store for the active tab
public/                      # static assets
```

Path alias: `@/*` → `src/*` (see `tsconfig.json`).

## Conventions

- **File naming**: kebab-case for files (`project-card.tsx`), PascalCase for
  component exports.
- **Components**: prefer Server Components; mark client components with
  `"use client"` at the top. Keep client boundaries small.
- **Data**: static portfolio content lives in `src/lib/data/*` — edit there,
  not inline in components.
- **UI primitives**: extend `components/ui/*` rather than re-implementing
  buttons, cards, etc. Use `cn()` from `lib/utils.ts` to merge classes.
- **AI tools**: every new tool goes in `src/lib/tools.ts`. Inline tools render
  via `components/apps/chat/tool-renderers/*`; tab-switching tools call into
  the Zustand tab store.
- **Validation**: validate request bodies and tool inputs with Zod.
- **No secrets in code** — read from `process.env` only, in route handlers or
  server components.

## Commands

Use **pnpm** (a `pnpm-lock.yaml` is present):

```bash
pnpm install
pnpm dev          # next dev
pnpm build        # next build
pnpm start        # next start
pnpm lint         # eslint
```

## Environment variables

Required for full functionality:

- `ANTHROPIC_API_KEY` — for `/api/chat`
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL` — for
  `/api/voice-token` and the voice chat client
- `NEXT_PUBLIC_LIVEKIT_URL` — public LiveKit URL for the browser client

Put local values in `.env.local` (gitignored).

## When adding features

- **New AI tool**: define schema + handler in `src/lib/tools.ts`, add a
  renderer under `components/apps/chat/tool-renderers/` if it streams UI,
  and update the system prompt in `src/app/api/chat/route.ts` so the model
  knows when to call it.
- **New app/tab**: add a folder under `components/apps/<name>/`, register it
  in the tab store and nav bar, and keep its data in `lib/data/`.
- **New UI primitive**: prefer `pnpm dlx shadcn@latest add <component>` so it
  lands in `components/ui/` consistent with the rest.

## Quality gates before committing

- `pnpm lint` clean
- `pnpm build` succeeds (catches RSC / typing issues `next dev` may hide)
- No `any` types added; no unused exports
- No new top-level dependencies without justification

## Things not to do

- Don't re-introduce the create-next-app boilerplate README.
- Don't add a second package manager lockfile.
- Don't put portfolio content (projects, jobs, skills) in components — it
  belongs in `src/lib/data/`.
- Don't bypass the rate limiter in `api/chat/route.ts` without replacing it
  with something better (e.g. Upstash) — it's there for a reason.
- Don't hardcode the Claude model string in multiple places; keep it
  centralized in the chat route.
