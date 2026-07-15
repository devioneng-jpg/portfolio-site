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
      <div className="flex min-h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:min-h-20 sm:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            01 / Interactive portfolio
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Explore the work in your preferred format
          </p>
        </div>
        <ChatModeToggle mode={mode} onModeChange={setMode} />
      </div>

      <div
        className="min-h-0 min-w-0 flex-1 overflow-hidden"
        data-testid="chat-mode-content"
      >
        {mode === "text" ? (
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              error={error}
            />
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="h-full min-h-0 min-w-0">
            <VoiceChat />
          </div>
        )}
      </div>
    </div>
  );
}
