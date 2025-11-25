import { useRouter } from "next/router";
import React from "react";
import { rhythm } from "../lib/typography";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: string | number;
}

export default function Layout({
  children,
  maxWidth = rhythm(32),
}: LayoutProps) {
  const router = useRouter();

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(32),
        padding: `${rhythm(1)} ${rhythm(1)}`,
      }}
    >
      <Navbar location={router.pathname} />
      <div
        style={{
          maxWidth,
          marginLeft: `auto`,
          marginRight: `auto`,
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
