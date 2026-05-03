# Dev-GPT — Devion Tharpe's Portfolio

A personal portfolio for **Devion Tharpe** (Senior Solutions Engineer, Twilio)
styled as an OS/desktop with tab-based "apps." The centerpiece is **Dev-GPT**,
an AI assistant that knows Devion's background and can answer questions,
render structured results inline (project cards, skill badges, experience
timeline), or switch tabs to a fuller view — including a LiveKit-powered
voice mode.

## Apps

| Tab | Description |
|-----|-------------|
| **Resume** | Formal resume view (`components/apps/resume`) |
| **Projects** | Project gallery with cards (`components/apps/projects`) |
| **Chat** | Streaming AI chat with tool calls + voice mode (`components/apps/chat`) |
| **Contact** | Contact form / social links (`components/apps/contact`) |

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`, shadcn-style primitives
  (Base UI + CVA + `tailwind-merge`)
- **State**: Zustand (active-tab store)
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) with
  Anthropic Claude; tool calls drive inline UI and tab switching
- **Voice**: LiveKit (`livekit-client`, `@livekit/components-react`,
  `livekit-server-sdk`)
- **Validation**: Zod 4
- **Animation**: Motion (Framer Motion successor)
- **Windows**: `react-rnd` for draggable/resizable surfaces

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

# Required for voice mode (/api/voice-token + browser client)
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

The chat tab works without LiveKit; voice mode requires all four LiveKit
variables.

## Scripts

```bash
pnpm dev          # next dev
pnpm build        # next build
pnpm start        # next start (after build)
pnpm lint         # eslint
```

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

- `projects.ts` — project gallery entries
- `experience.ts` — work history / timeline
- `skills.ts` — tech stack
- `social-links.ts` — contact + social URLs

Edit there, not inline in components.

## How Dev-GPT works

`/api/chat` streams from Anthropic via the Vercel AI SDK. The model is given
a system prompt describing Devion plus a set of tools defined in
`src/lib/tools.ts`:

- **Inline tools** (`showProjects`, `showSkills`, `showExperience`,
  `showAbout`) render structured cards directly in the chat thread via
  renderers in `components/apps/chat/tool-renderers/`.
- **Tab-switching tools** (`switchToProjects`, `switchToContact`,
  `switchToResume`) call into the Zustand tab store to navigate the OS shell.

A simple in-memory rate limiter caps usage at ~30 requests/hour per IP.

## Deployment

Designed to deploy cleanly to Vercel. Set the environment variables above in
the project's dashboard, then push to your default branch. For voice mode,
provision a LiveKit Cloud project and copy the credentials.

## License

Personal portfolio — no license granted for reuse of the content
(copy, bio, project descriptions, branding). The scaffolding code is fine
to learn from.
