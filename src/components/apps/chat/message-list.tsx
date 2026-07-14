"use client";

import { useRef, useEffect } from "react";
import type { PortfolioMessage } from "@/lib/chat-types";
import { MessageBubble } from "./message-bubble";
import { Bot, AlertCircle } from "lucide-react";

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
      className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 scrollbar-thin sm:px-6"
    >
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="gradient-surface flex size-14 items-center justify-center rounded-2xl bg-card">
            <Bot className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Hey! I&apos;m Devion&apos;s <span className="gradient-text">AI Twin</span>
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Ask me anything about Devion&apos;s work, projects, skills, or
              experience.
            </p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-2 items-start">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
            <Bot className="w-3.5 h-3.5 text-foreground/70" />
          </div>
          <div className="flex gap-1 py-2">
            <span className="size-1.5 animate-bounce rounded-full bg-primary" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.3s]" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-2 items-start p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">
            {error.message || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
