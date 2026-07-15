"use client";

import { MessageSquare, Mic } from "lucide-react";

export type ChatMode = "text" | "voice";

interface ChatModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function ChatModeToggle({ mode, onModeChange }: ChatModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Conversation mode"
      className="flex items-center border border-border bg-background"
    >
      <button
        type="button"
        aria-pressed={mode === "text"}
        onClick={() => onModeChange("text")}
        className={`flex h-8 items-center gap-1.5 border-r border-border px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          mode === "text"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <MessageSquare className="size-3.5" aria-hidden="true" />
        Text
      </button>
      <button
        type="button"
        aria-pressed={mode === "voice"}
        onClick={() => onModeChange("voice")}
        className={`flex h-8 items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          mode === "voice"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <Mic className="size-3.5" aria-hidden="true" />
        Voice
      </button>
    </div>
  );
}
