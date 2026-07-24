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
import { sanitizeExternalUrl } from "@/lib/safe-url";
import { PrivacyNotice } from "./privacy-notice";

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
      <div className="relative flex size-40 items-center justify-center border border-border sm:size-48">
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            state === "speaking"
              ? "bg-primary/20"
              : state === "listening"
                ? "bg-primary/10"
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
            className={`flex size-16 items-center justify-center ${
              isActive ? "bg-primary/20" : "bg-muted"
            }`}
          >
            {isActive ? (
              <Mic className="size-8 text-primary" aria-hidden="true" />
            ) : (
              <MicOff
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
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
          className="max-w-sm border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive"
        >
          {microphoneError}
        </p>
      )}

      <DisconnectButton className="inline-flex cursor-pointer items-center justify-center gap-2 border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <PhoneOff className="size-4" aria-hidden="true" />
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
  const bookingUrl = sanitizeExternalUrl(connectionDetails?.bookingUrl, {
    allowedHosts: ["cal.com"],
  });

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto p-6">
        <div className="text-center">
          <p className="text-sm font-bold text-destructive" role="alert">
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
          className="gap-2 rounded-none border-border text-[10px] font-bold uppercase tracking-[0.12em]"
        >
          <Phone className="size-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center overflow-y-auto p-5 sm:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_18rem] md:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              Live conversation / Browser audio
            </p>
            <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] font-bold leading-[0.86] tracking-[-0.065em] text-foreground">
              Voice Chat with Devion&apos;s AI Twin<span className="text-primary">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Have a natural conversation about Devion&apos;s experience,
              architecture decisions, and approach to customer problems.
            </p>
          </div>
          <div className="border-t border-border pt-5">
            <div className="mb-8 flex size-12 items-center justify-center border border-primary bg-primary text-primary-foreground">
              <Mic className="size-5" aria-hidden="true" />
            </div>
            <Button
              onClick={connect}
              disabled={isConnecting}
              aria-busy={isConnecting}
              className="h-11 w-full justify-between rounded-none bg-foreground px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-background hover:bg-primary hover:text-primary-foreground"
            >
              {isConnecting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Phone className="size-4" aria-hidden="true" />
              )}
              {isConnecting ? "Connecting..." : "Start Voice Chat"}
            </Button>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              Microphone permission is requested only when you connect.
            </p>
            <PrivacyNotice voice />
          </div>
        </div>
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
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Calendar className="size-4" aria-hidden="true" />
            Book time with Devion
          </a>
        )}
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
