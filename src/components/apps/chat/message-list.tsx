"use client";

import { useRef, useEffect } from "react";
import type { PortfolioMessage } from "@/lib/chat-types";
import { MessageBubble } from "./message-bubble";
import { ArrowDownRight, AlertCircle } from "lucide-react";

interface MessageListProps {
  messages: PortfolioMessage[];
  isLoading: boolean;
  error?: Error | undefined;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    bottomRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat conversation"
      className="min-h-0 min-w-0 flex-1 space-y-7 overflow-y-auto px-4 py-5 scrollbar-thin sm:px-8 sm:py-8"
    >
      {messages.length === 0 && (
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            Available now / Text + voice
          </p>
          <div className="grid gap-8 md:grid-cols-[1fr_15rem] md:items-end">
            <div>
              <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,6.5rem)] font-bold leading-[0.86] tracking-[-0.065em] text-foreground">
                Hey! I&apos;m Devion&apos;s AI Twin
                <span className="text-primary">.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Ask a direct question. Get a grounded answer about Devion&apos;s
                work, technical judgment, and production-minded AI systems.
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <ArrowDownRight className="mb-8 size-6 text-primary" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Start with a prompt below
              </p>
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-2 items-start">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-border bg-card">
            <span className="text-[9px] font-bold text-foreground/70">AI</span>
          </div>
          <div className="flex gap-1 py-2">
            <span className="size-1.5 animate-bounce rounded-full bg-primary" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.3s]" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p className="text-xs text-destructive">
            {error.message || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
