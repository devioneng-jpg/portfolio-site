"use client";

import Script from "next/script";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      theme: "dark";
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type GateState = "checking" | "challenge" | "verifying" | "verified" | "error";

export function TurnstileGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("checking");
  const [message, setMessage] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const checkSession = useCallback(async () => {
    setState("checking");
    setMessage(null);
    try {
      const response = await fetch("/api/security/challenge", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = (await response.json()) as { verified?: boolean };
      setState(response.ok && data.verified ? "verified" : "challenge");
    } catch {
      setMessage("Verification could not be loaded. Check your connection.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const verifyToken = useCallback(async (token: string) => {
    setState("verifying");
    setMessage(null);
    try {
      const response = await fetch("/api/security/challenge", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as {
        verified?: boolean;
        error?: string;
      };

      if (!response.ok || !data.verified) {
        throw new Error(data.error || "Verification failed");
      }
      setState("verified");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again."
      );
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (
      state !== "challenge" ||
      !scriptReady ||
      !siteKey ||
      !window.turnstile ||
      !containerRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "portfolio-access",
      theme: "dark",
      callback: (token) => void verifyToken(token),
      "error-callback": () => {
        setMessage("The verification service could not complete the check.");
        setState("error");
      },
      "expired-callback": () => {
        setMessage("The verification expired. Please try again.");
        setState("error");
      },
    });
  }, [scriptReady, siteKey, state, verifyToken]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const retry = () => {
    setMessage(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
    }
    widgetIdRef.current = null;
    setState("challenge");
  };

  if (state === "verified") return children;

  return (
    <div className="flex h-full min-h-0 items-center justify-center overflow-y-auto p-6">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8">
        <div className="mb-5 flex size-11 items-center justify-center border border-primary text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">
          One quick security check
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This protects the public AI and voice services from automated abuse.
          Verification lasts for one hour.
        </p>

        {(state === "checking" || state === "verifying") && (
          <div
            className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
            role="status"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {state === "checking"
              ? "Checking this browser..."
              : "Confirming verification..."}
          </div>
        )}

        {state === "challenge" && siteKey && (
          <div className="mt-6 min-h-16" ref={containerRef} />
        )}

        {state === "challenge" && !siteKey && (
          <p className="mt-6 text-xs text-destructive" role="alert">
            Verification is not configured for this deployment.
          </p>
        )}

        {state === "error" && (
          <div className="mt-6 space-y-3">
            <p className="text-xs leading-relaxed text-destructive" role="alert">
              {message}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retry}
              className="gap-2 rounded-none"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

