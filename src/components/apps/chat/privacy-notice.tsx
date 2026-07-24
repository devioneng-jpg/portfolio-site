import Link from "next/link";

export function PrivacyNotice({ voice = false }: { voice?: boolean }) {
  return (
    <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
      {voice
        ? "Voice and transcripts are processed by LiveKit and AI providers. "
        : "Messages are processed by Anthropic and may be traced in Langfuse. "}
      Do not share passwords, secrets, or sensitive personal information.{" "}
      <Link
        href="/privacy"
        className="font-semibold text-foreground underline decoration-border underline-offset-2 transition-colors hover:text-primary"
      >
        Privacy details
      </Link>
    </p>
  );
}

