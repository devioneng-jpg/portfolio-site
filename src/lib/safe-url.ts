interface SafeUrlOptions {
  allowedHosts?: readonly string[];
  allowedProtocols?: readonly string[];
}

export function sanitizeExternalUrl(
  value: unknown,
  {
    allowedHosts,
    allowedProtocols = ["https:"],
  }: SafeUrlOptions = {}
): string | null {
  if (typeof value !== "string" || value.length > 2_048) return null;

  try {
    const url = new URL(value);
    if (!allowedProtocols.includes(url.protocol)) return null;
    if (url.username || url.password) return null;

    if (
      allowedHosts &&
      !allowedHosts.some(
        (host) =>
          url.hostname === host || url.hostname.endsWith(`.${host}`)
      )
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

