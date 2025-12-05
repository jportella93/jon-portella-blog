import Link from "next/link";
import { NAVIGATION_PAGES } from "../lib/constants";
import { rhythm } from "../lib/typography";
import ThemeSwitcher from "./ThemeSwitcher";

interface NavbarProps {
  location: string;
}

export default function Navbar({ location }: NavbarProps) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
      }}
    >
      <ul
        style={{
          display: "flex",
          margin: 0,
        }}
      >
        {NAVIGATION_PAGES.map(({ label, url }) => (
          <li
            key={url}
            style={{
              listStyle: "none",
              marginRight: rhythm(0.5),
              marginBottom: 0,
            }}
          >
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
