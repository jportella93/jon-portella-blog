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
  | string
  | {
      count?: number | string;
      count_unique?: number | string;
      hits?: number | string;
      visits?: number | string;
      total?: number | string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [k: string]: any;
    };

export function extractGoatCounterCount(data: GoatCounterCounterResponse): number | null {
  if (typeof data === "number" && Number.isFinite(data)) return data;
  if (typeof data === "string") {
    const n = Number.parseInt(data, 10);
    return Number.isFinite(n) ? n : null;
  }
  if (!data || typeof data !== "object") return null;

  const maybe =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).count ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).count_unique ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).visits ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).hits ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).total;

  if (typeof maybe === "number" && Number.isFinite(maybe)) return maybe;
  if (typeof maybe === "string") {
    const n = Number.parseInt(maybe, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export {};
