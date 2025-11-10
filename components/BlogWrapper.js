import React from 'react';
import Link from 'next/link';
import { rhythm, scale } from '../lib/typography';

export default function BlogWrapper({ text, location, rootPath, Component = "header" }) {
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

