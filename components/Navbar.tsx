import Link from "next/link";
import { rhythm } from "../lib/typography";
import ThemeSwitcher from "./ThemeSwitcher";

interface NavbarProps {
  location: string;
}

export default function Navbar({ location }: NavbarProps) {
  const links = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Blog",
      url: "/blog",
    },
    {
      label: "Timeline",
      url: "/timeline",
    },
    {
      label: "Contact",
      url: "/contact",
    },
    {
      label: "RSS",
      url: "/rss.xml",
    },
  ];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ul style={{ display: "flex", margin: 0 }}>
        {links.map(({ label, url }) => (
          <li key={url} style={{ listStyle: "none", marginRight: rhythm(0.5) }}>
            <Link
              href={url}
              style={{
                textDecoration: location === url ? "line-through" : "none",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <ThemeSwitcher />
    </nav>
  );
}
