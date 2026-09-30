export function safeReturnPath(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.includes("\\") &&
    !/^\/(login|register)(\/|\?|#|$)/.test(from)
    ? from
    : "/";
}
