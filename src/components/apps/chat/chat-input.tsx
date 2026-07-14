"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="shrink-0 border-t border-border/70 bg-card/30 p-3 sm:px-5 sm:py-4">
      {input === "" && (
        <div className="mb-2.5 flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide sm:flex-wrap">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSubmit(prompt)}
              className="shrink-0 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        className="gradient-surface flex gap-2 rounded-xl bg-card p-1"
      >
        <Input
          aria-label="Ask Devion's AI Twin a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="h-10 flex-1 border-0 bg-transparent px-3 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-transparent"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={isLoading || !input.trim()}
          className="size-10 shrink-0 rounded-lg bg-foreground text-background hover:bg-foreground/85"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
