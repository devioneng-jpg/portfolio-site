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
    <div className="border-t border-border p-3">
      {input === "" && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSubmit(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary/80 hover:bg-primary/15 hover:text-primary transition-colors border border-primary/20"
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
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="shrink-0 bg-primary/15 hover:bg-primary/25 text-primary"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
