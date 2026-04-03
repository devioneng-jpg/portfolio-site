"use client";

import { MessageSquare, Mic } from "lucide-react";

export type ChatMode = "text" | "voice";

interface ChatModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function ChatModeToggle({ mode, onModeChange }: ChatModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
      <button
        onClick={() => onModeChange("text")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          mode === "text"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Chat
      </button>
      <button
        onClick={() => onModeChange("voice")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          mode === "voice"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Mic className="w-3.5 h-3.5" />
        Voice
      </button>
    </div>
  );
}
