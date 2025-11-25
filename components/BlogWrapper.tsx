import React from 'react';
import Link from 'next/link';
import { rhythm, scale } from '../lib/typography';

interface BlogWrapperProps {
  text: string;
  location: string;
  rootPath: string;
  Component?: React.ElementType;
}

export default function BlogWrapper({ text, location, rootPath, Component = "header" }: BlogWrapperProps) {
  return (
    <Component>
      <nav>
        <Link
          href="/blog"
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
        >
          <h1
            style={{
              ...scale(1.5),
              marginBottom: rhythm(1),
              marginTop: rhythm(1),
            }}
          >
            {text}
          </h1>
        </Link>
      </nav>
    </Component>
  );
}




