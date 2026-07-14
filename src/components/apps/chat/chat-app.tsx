"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatModeToggle, type ChatMode } from "./chat-mode-toggle";
import { VoiceChat } from "./voice-chat";
import type { PortfolioMessage } from "@/lib/chat-types";

export function ChatApp() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("text");

  const { messages, sendMessage, status, error } = useChat<PortfolioMessage>({});

  const isLoading =
    !error && (status === "streaming" || status === "submitted");

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div
      id="chat-panel"
      role="tabpanel"
      aria-labelledby="chat-tab"
      className="flex h-full min-h-0 flex-col"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/70 bg-card/30 px-3 py-2.5 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Conversation
          </p>
          <p className="hidden text-xs text-foreground/80 sm:block">
            Ask about my work, approach, or experience
          </p>
        </div>
        <ChatModeToggle mode={mode} onModeChange={setMode} />
      </div>

      <div className="min-h-0 flex-1" data-testid="chat-mode-content">
        {mode === "text" ? (
          <div className="flex h-full min-h-0 flex-col">
          <MessageList messages={messages} isLoading={isLoading} error={error} />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          </div>
        ) : (
          <div className="h-full min-h-0">
            <VoiceChat />
          </div>
        )}
      </div>
    </div>
  );
}
