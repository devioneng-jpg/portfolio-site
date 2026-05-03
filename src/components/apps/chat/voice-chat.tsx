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
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionDetails {
  token: string;
  url: string;
  roomName: string;
}

function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  // Ensure microphone is enabled when connected
  useEffect(() => {
    if (!isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(true).catch((err) => {
        console.error("[VoiceChat] Failed to enable mic:", err);
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
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            state === "speaking"
              ? "bg-primary/20 animate-pulse"
              : state === "listening"
                ? "bg-primary/10"
                : "bg-muted/30"
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
              isActive ? "bg-primary/20" : "bg-muted/50"
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
        <p className="text-sm font-medium text-foreground">{stateLabel}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isActive
            ? "Devion&apos;s AI Twin is ready to talk"
            : "Waiting for connection..."}
        </p>
      </div>

      <DisconnectButton className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/50 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
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
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
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
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Mic className="w-10 h-10 text-primary/60" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Voice Chat with Devion&apos;s AI Twin
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Talk to Devion&apos;s AI Twin using your microphone. Powered by ElevenLabs &
            LiveKit.
          </p>
        </div>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="gap-2 bg-primary/15 hover:bg-primary/25 text-primary"
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
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.url}
        connect={true}
        audio={true}
        onDisconnected={disconnect}
        className="flex flex-col items-center gap-4"
      >
        <VoiceAssistantUI />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
