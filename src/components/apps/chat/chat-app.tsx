"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useTabStore, type TabId } from "@/stores/tab-store";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatModeToggle, type ChatMode } from "./chat-mode-toggle";
import { VoiceChat } from "./voice-chat";

export function ChatApp() {
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("text");

  const { messages, sendMessage, status, error } = useChat({
    onToolCall({ toolCall }) {
      const tabTools: Record<string, TabId> = {
        switchToProjects: "projects",
        switchToContact: "contact",
        switchToResume: "resume",
      };
      const tabId = tabTools[toolCall.toolName];
      if (tabId) {
        setActiveTab(tabId);
      }
    },
    sendAutomaticallyWhen({ messages }) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role !== "assistant") return false;
      const hasToolParts = lastMessage.parts.some(
        (p) => p.type.startsWith("tool-") || p.type === "dynamic-tool"
      );
      return hasToolParts;
    },
  });

  const isLoading =
    !error && (status === "streaming" || status === "submitted");

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center py-2 border-b border-border">
        <ChatModeToggle mode={mode} onModeChange={setMode} />
      </div>

      {mode === "text" ? (
        <>
          <MessageList messages={messages} isLoading={isLoading} error={error} />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </>
      ) : (
        <VoiceChat />
      )}
    </div>
  );
}
