import { KBarProvider } from "kbar";
import { AppProps } from "next/app";
import SearchModal from "../components/SearchModal";
import { ThemeProvider } from "../components/ThemeProvider";
import { useGlobalKeyboardShortcuts } from "../lib/useGlobalKeyboardShortcuts";
import "../styles/globals.css";

function AppContent({ Component, pageProps }: AppProps) {
  useGlobalKeyboardShortcuts();

  return (
    <>
      <Component {...pageProps} />
      <SearchModal />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <KBarProvider>
        <AppContent {...props} />
      </KBarProvider>
    </ThemeProvider>
  );
}
