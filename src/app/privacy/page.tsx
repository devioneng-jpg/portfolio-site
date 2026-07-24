import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy | Devion's AI Twin",
  description:
    "How the portfolio's text and voice AI features process visitor data.",
};

const sections = [
  {
    title: "What is processed",
    body: "Text messages are sent to Anthropic to generate answers. Voice conversations use LiveKit and the providers configured for the deployed voice agent. Technical telemetry may be sent to Langfuse when tracing is enabled.",
  },
  {
    title: "What this site stores",
    body: "The portfolio does not maintain its own database of chat transcripts. Short-lived security cookies are used to remember bot verification and do not identify you by name.",
  },
  {
    title: "Anonymous site metrics",
    body: "Vercel Web Analytics records privacy-friendly page-view and navigation metrics in production. It does not run during local development.",
  },
  {
    title: "What not to submit",
    body: "Do not share passwords, API keys, financial information, health information, or other sensitive personal data. This assistant is a public portfolio experience, not a confidential channel.",
  },
  {
    title: "Abuse prevention",
    body: "The site uses Cloudflare Turnstile, hashed network identifiers, and request limits to protect paid AI and voice services. Raw IP addresses are not used as Redis rate-limit keys.",
  },
  {
    title: "Third-party retention",
    body: "Anthropic, LiveKit, Cloudflare, and Langfuse process data under their own terms and retention settings. Production tracing should remain disabled unless its retention and redaction controls have been reviewed.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-background px-5 py-8 text-foreground sm:px-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to portfolio
        </Link>

        <header className="mt-12 border-b border-border pb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Privacy and AI processing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
            Clear expectations for a public AI portfolio.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            This page explains where text and voice data goes, what the site
            retains, and what visitors should avoid sharing.
          </p>
        </header>

        <div className="divide-y divide-border">
          {sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-3 py-7 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <h2 className="text-sm font-bold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="border-t border-border pt-6 text-xs text-muted-foreground">
          Last updated July 22, 2026.
        </p>
      </div>
    </main>
  );
}

