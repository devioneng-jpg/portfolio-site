"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrivacyNotice } from "./privacy-notice";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const suggestedPrompts = [
  "What are your projects?",
  "Tell me about yourself",
  "What's your tech stack?",
  "How can I reach you?",
];

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="min-w-0 shrink-0 border-t border-border bg-card p-3 sm:px-8 sm:py-5">
      {input === "" && (
        <div className="mb-2.5 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSubmit(prompt)}
              className="min-w-0 border border-border bg-background px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:shrink-0 sm:px-3 sm:text-[10px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
        }}
        className="flex gap-2 border border-foreground bg-background p-1"
      >
        <Input
          aria-label="Ask Devion's AI Twin a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about Devion..."
          disabled={isLoading}
          className="h-10 flex-1 border-0 bg-transparent px-3 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-transparent"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={isLoading || !input.trim()}
          className="size-10 shrink-0 rounded-none bg-primary text-primary-foreground hover:bg-primary/85"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </form>
      <PrivacyNotice />
    </div>
  );
}
