import { KBarProvider } from "kbar";
import { AppProps } from "next/app";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SearchModal from "../components/SearchModal";
import { ThemeProvider } from "../components/ThemeProvider";
import { normalizeGoatCounterPath } from "../lib/goatcounter";
import { useGlobalKeyboardShortcuts } from "../lib/useGlobalKeyboardShortcuts";
import "../styles/globals.css";

function AppContent({ Component, pageProps }: AppProps) {
  useGlobalKeyboardShortcuts();

  return (
    <>
      <Script
        id="goatcounter"
        data-goatcounter="https://jonportella.goatcounter.com/count"
        src="https://gc.zgo.at/count.js"
        strategy="lazyOnload"
      />
      <Component {...pageProps} />
      <SearchModal />
    </>
  );
}

export default function App(props: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeComplete = (url: string) => {
      const path = normalizeGoatCounterPath(url);

      const run = () => {
        window.goatcounter?.count?.({ path });
      };

      // Schedule counting off the critical path.
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };

      if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(run, { timeout: 2000 });
      else setTimeout(run, 1);
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <ThemeProvider>
      <KBarProvider>
        <AppContent {...props} />
      </KBarProvider>
    </ThemeProvider>
  );
}
