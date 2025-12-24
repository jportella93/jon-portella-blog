declare global {
  interface Window {
    goatcounter?: {
      count?: (args?: { path?: string; title?: string; event?: boolean }) => void;
      visit_count?: (args?: unknown) => void;
    };
  }
}

/**
 * Normalize a Next.js `asPath`/URL to the path GoatCounter uses for counting.
 * We intentionally ignore query/hash so counters are per-page.
 */
export function normalizeGoatCounterPath(asPathOrUrl: string): string {
  const withoutQueryOrHash = asPathOrUrl.split(/[?#]/)[0] ?? "/";
  if (!withoutQueryOrHash) return "/";
  return withoutQueryOrHash.startsWith("/") ? withoutQueryOrHash : `/${withoutQueryOrHash}`;
}

export const GOATCOUNTER_SITE = "https://jonportella.goatcounter.com" as const;

export function getGoatCounterCounterUrl(path: string): string {
  // GoatCounter expects the path segment URL-encoded.
  return `${GOATCOUNTER_SITE}/counter/${encodeURIComponent(path)}.json`;
}

export type GoatCounterCounterResponse =
  | number
  | {
      count?: number;
      hits?: number;
      visits?: number;
      total?: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [k: string]: any;
    };

export function extractGoatCounterCount(data: GoatCounterCounterResponse): number | null {
  if (typeof data === "number" && Number.isFinite(data)) return data;
  if (!data || typeof data !== "object") return null;

  const maybe =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).count ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).visits ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).hits ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).total;

  return typeof maybe === "number" && Number.isFinite(maybe) ? maybe : null;
}

export {};
