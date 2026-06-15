import { Langfuse } from "langfuse";

let langfuseInstance: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
  if (
    !process.env.LANGFUSE_SECRET_KEY ||
    !process.env.LANGFUSE_PUBLIC_KEY ||
    !process.env.LANGFUSE_BASEURL
  ) {
    return null;
  }

  if (!langfuseInstance) {
    langfuseInstance = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      baseUrl: process.env.LANGFUSE_BASEURL,
    });
  }

  return langfuseInstance;
}

export function buildTraceUrl(traceId: string): string | null {
  const baseUrl = process.env.LANGFUSE_BASEURL;
  const projectId = process.env.LANGFUSE_PROJECT_ID;
  if (!baseUrl || !projectId) return null;
  return `${baseUrl}/project/${projectId}/traces/${traceId}`;
}
