import React from 'react';
import { useRouter } from 'next/router';
import BlogWrapper from './BlogWrapper';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const router = useRouter();
  const rootPath = '/blog';

  return (
    <>
      <BlogWrapper Component="header" location={router.pathname} rootPath={rootPath} text={'<>'} />
      {children}
      <BlogWrapper Component="footer" location={router.pathname} rootPath={rootPath} text={'</>'} />
    </>
  );
}






