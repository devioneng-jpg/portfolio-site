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
      className="flex items-center gap-0.5 rounded-lg border border-border/80 bg-background/70 p-1"
    >
      <button
        type="button"
        aria-pressed={mode === "text"}
        onClick={() => onModeChange("text")}
        className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          mode === "text"
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Chat
      </button>
      <button
        type="button"
        aria-pressed={mode === "voice"}
        onClick={() => onModeChange("voice")}
        className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          mode === "voice"
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <Mic className="w-3.5 h-3.5" />
        Voice
      </button>
    </div>
  );
}
