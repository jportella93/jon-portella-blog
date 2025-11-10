import { Html, Head, Main, NextScript } from 'next/document';
import typography from '../lib/typography';

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cssPath = basePath ? `${basePath}/code-syntax.css` : '/code-syntax.css';
  
  return (
    <Html>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: typography.toString() }} />
        <link rel="stylesheet" href={cssPath} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
