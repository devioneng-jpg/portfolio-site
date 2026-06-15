"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatModeToggle, type ChatMode } from "./chat-mode-toggle";
import { VoiceChat } from "./voice-chat";

export function ChatApp() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("text");

  const { messages, sendMessage, status, error } = useChat({});

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
