import { AppProps } from "next/app";
import { useState } from "react";
import SearchModal from "../components/SearchModal";
import { ThemeProvider } from "../components/ThemeProvider";
import { useGlobalKeyboardShortcuts } from "../lib/useGlobalKeyboardShortcuts";
import "../styles/globals.css";
import "../styles/timeline.css";

function AppContent({ Component, pageProps }: AppProps) {
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  useGlobalKeyboardShortcuts({
    isSearchModalOpen,
    setSearchModalOpen,
  });

  return (
    <>
      <Component {...pageProps} />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <AppContent {...props} />
    </ThemeProvider>
  );
}
