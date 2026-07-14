# Vercel Launch Checklist

Use this checklist for the production project named `portfolio-site`. A second
historical project (`portfolio-site-tli2`) also exists; confirm it is still
needed before changing or removing it.

## Project configuration

- Set `APP_URL` to the canonical production domain.
- Set `ANTHROPIC_API_KEY` and optionally override `ANTHROPIC_MODEL`.
- Set `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and a strong,
  unique `RATE_LIMIT_SALT`.
- Set the four LiveKit variables: `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`,
  `LIVEKIT_URL`, and `LIVEKIT_AGENT_NAME`.
- Set Langfuse keys if production traces are required. Keep
  `NEXT_PUBLIC_SHOW_AI_TRACE=false` for normal visitors.
- Apply secrets to Preview and Production deliberately; never expose
  server-only values with a `NEXT_PUBLIC_` prefix.

## Automated release gates

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`
- GitHub Actions checks are green for both `quality` and `browser-smoke`.

## Preview smoke test

- Chat loads without hydration or CSP errors.
- A text question streams a response and renders project/tool output.
- Projects, Resume, and Contact tabs work by click and keyboard.
- Project source links open the expected public GitHub repositories.
- Cal.com and social links open safely.
- Voice mode explains missing configuration cleanly or starts a room with the
  configured LiveKit agent; denied microphone permission is actionable.
- The layout remains usable at 390px and desktop widths.
- `/opengraph-image` renders and share metadata uses the preview URL.

## Production promotion

- Promote the reviewed preview instead of creating an unrelated deployment.
- Confirm the canonical domain matches `APP_URL`.
- Confirm `robots` is indexable only after content and metadata approval.
- Verify response headers include CSP, HSTS, frame denial, content-type
  protection, referrer policy, and microphone permissions.
- Verify Upstash counters are receiving separate chat and voice keys.
- Verify Langfuse receives traces without exposing trace links publicly.
- Monitor Anthropic, LiveKit, Upstash, and Vercel usage after release.
