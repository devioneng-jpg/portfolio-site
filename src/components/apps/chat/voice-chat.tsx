"use client";

import { useState, useCallback, useEffect } from "react";
import {
  LiveKitRoom,
  useVoiceAssistant,
  useLocalParticipant,
  BarVisualizer,
  RoomAudioRenderer,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
  Calendar,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionDetails {
  token: string;
  url: string;
  roomName: string;
  bookingUrl: string;
}

function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);

  // Ensure microphone is enabled when connected
  useEffect(() => {
    if (!isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(true).catch((err) => {
        console.error("[VoiceChat] Failed to enable mic:", err);
        setMicrophoneError(
          "Microphone access was blocked. Allow microphone access in your browser settings, then reconnect."
        );
      });
    }
  }, [localParticipant, isMicrophoneEnabled]);

  const stateLabels: Record<string, string> = {
    disconnected: "Disconnected",
    connecting: "Connecting...",
    initializing: "Initializing...",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
  };

  const stateLabel = stateLabels[state] ?? state;
  const isActive = state === "listening" || state === "speaking";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex size-40 items-center justify-center sm:size-48">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            state === "speaking"
              ? "bg-primary/20 shadow-[0_0_70px_-15px_var(--color-primary)] animate-pulse"
              : state === "listening"
                ? "bg-primary/10 shadow-[0_0_55px_-20px_var(--color-primary)]"
                : "border border-border bg-card"
          }`}
        />
        {audioTrack && (
          <BarVisualizer
            state={state}
            trackRef={audioTrack}
            barCount={5}
            style={{ width: "100%", height: "100%" }}
          />
        )}
        {!audioTrack && (
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive ? "bg-primary/20" : "bg-muted"
            }`}
          >
            {isActive ? (
              <Mic className="w-8 h-8 text-primary" />
            ) : (
              <MicOff className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground" aria-live="polite">
          {stateLabel}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isActive
            ? "Devion's AI Twin is ready to talk"
            : "Waiting for connection..."}
        </p>
      </div>

      {microphoneError && (
        <p
          role="alert"
          className="max-w-sm rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive"
        >
          {microphoneError}
        </p>
      )}

      <DisconnectButton className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <PhoneOff className="w-4 h-4" />
        End Call
      </DisconnectButton>
    </div>
  );
}

export function VoiceChat() {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/voice-token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get voice token");
      }
      setConnectionDetails(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to voice"
      );
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnectionDetails(null);
  }, []);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto p-6">
        <div className="text-center">
          <p className="text-sm text-destructive font-medium">
            Connection Error
          </p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setError(null);
            connect();
          }}
          className="gap-2"
        >
          <Phone className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-6">
        <div className="gradient-surface flex size-24 items-center justify-center rounded-full bg-card shadow-2xl shadow-primary/10">
          <Mic className="size-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Voice Chat with Devion&apos;s <span className="gradient-text">AI Twin</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Talk to Devion&apos;s AI Twin using your microphone. Voice sessions
            are securely connected through LiveKit.
          </p>
        </div>
        <Button
          onClick={connect}
          disabled={isConnecting}
          aria-busy={isConnecting}
          className="h-10 gap-2 bg-foreground px-4 text-background hover:bg-foreground/85"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          {isConnecting ? "Connecting..." : "Start Voice Chat"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-6">
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.url}
        connect={true}
        audio={true}
        onDisconnected={disconnect}
        className="flex flex-col items-center gap-4"
      >
        <VoiceAssistantUI />
        <a
          href={connectionDetails.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Calendar className="size-4" aria-hidden="true" />
          Book time with Devion
        </a>
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
