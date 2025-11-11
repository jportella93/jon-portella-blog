import { Head, Html, Main, NextScript } from 'next/document';
import typography from '../lib/typography';

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cssPath = basePath ? `${basePath}/code-syntax.css` : '/code-syntax.css';
  
  return (
    <Html suppressHydrationWarning>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: typography.toString() }} />
        <link rel="stylesheet" href={cssPath} />
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
