import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import { rhythm } from '../lib/typography';

export default function Layout({ children, maxWidth = rhythm(32) }) {
  const router = useRouter();

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(32),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      <Navbar location={router.pathname} />
      <div style={{
        maxWidth,
        marginLeft: `auto`,
        marginRight: `auto`,
      }}>
        {children}
      </div>
    </div>
  );
}

