import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  extractGoatCounterCount,
  getGoatCounterCounterUrl,
  normalizeGoatCounterPath,
} from "../lib/goatcounter";

type VisitCounterState =
  | { kind: "loading" }
  | { kind: "ready"; count: number }
  | { kind: "unavailable"; reason?: string };

export default function VisitCounter() {
  const router = useRouter();

  const path = useMemo(() => normalizeGoatCounterPath(router.asPath), [router.asPath]);
  const [state, setState] = useState<VisitCounterState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    setState({ kind: "loading" });

    const run = async () => {
      try {
        // Give GoatCounter a moment to record the pageview (especially on SPA navigations).
        await new Promise((r) => setTimeout(r, 800));

        const res = await fetch(getGoatCounterCounterUrl(path), {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: abortController.signal,
        });

        if (!res.ok) {
          if (res.status === 403) {
            if (!cancelled) {
              setState({
                kind: "unavailable",
                reason: "Enable 'allow using the visitor counter' in GoatCounter settings.",
              });
            }
            return;
          }

          if (!cancelled) setState({ kind: "unavailable" });
          return;
        }

        const data = (await res.json()) as unknown;
        const count = extractGoatCounterCount(data as never);
        if (!cancelled) {
          setState(count === null ? { kind: "unavailable" } : { kind: "ready", count });
        }
      } catch (e) {
        if (!cancelled) setState({ kind: "unavailable" });
      }
    };

    // Keep this off the critical render path.
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };

    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 1);

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [path]);

  const title = state.kind === "unavailable" ? state.reason : undefined;

  return (
    <div
      style={{
        marginTop: "0.75rem",
        textAlign: "center",
        fontSize: "0.9rem",
        opacity: 0.8,
      }}
      aria-live="polite"
      title={title}
    >
      <span style={{ fontVariantNumeric: "tabular-nums" }}>
        Visits:{" "}
        {state.kind === "ready" ? state.count.toLocaleString() : state.kind === "loading" ? "…" : "—"}
      </span>
    </div>
  );
}

