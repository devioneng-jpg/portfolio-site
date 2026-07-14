export function buildTraceUrl(traceId: string): string | null {
  const baseUrl = process.env.LANGFUSE_BASEURL;
  const projectId = process.env.LANGFUSE_PROJECT_ID;
  if (!baseUrl || !projectId) return null;
  return `${baseUrl}/project/${projectId}/traces/${traceId}`;
}
