"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./message-bubble";
import { Bot, AlertCircle } from "lucide-react";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  error?: Error | undefined;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary/70" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/90">
              Hey! I&apos;m Dev-GPT
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
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
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-3.5 h-3.5 text-foreground/70" />
          </div>
          <div className="flex gap-1 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.3s]" />
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
