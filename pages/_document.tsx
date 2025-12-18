import { Head, Html, Main, NextScript } from "next/document";
import { BASE_PATH } from "../lib/constants";
import typography from "../lib/typography";

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{ __html: typography.toString() }} />
        <link rel="preconnect" href="https://cdn.ko-fi.com" />
      </Head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var root = document.documentElement;
                  
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {
                  // Ignore errors
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
