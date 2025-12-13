import Link from "next/link";
import { rhythm } from "../lib/typography";
import { EmailIcon, RssIcon } from "./icons";

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: rhythm(0.35),
  padding: `${rhythm(0.35)} ${rhythm(0.75)}`,
  border: "1px solid",
  borderColor: "var(--border-color, currentColor)",
  borderRadius: "999px",
  textDecoration: "none",
  color: "inherit",
  fontSize: "0.9em",
  transition: "opacity 0.2s",
};

const buttons = [
  {
    href: "/rss.xml",
    Icon: RssIcon,
    text: "RSS Feed",
  },
  {
    href: "https://buttondown.email/jportella93",
    Icon: EmailIcon,
    text: "Get an Email",
  },
];

const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
  (e.currentTarget.style.opacity = "0.7");

const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
  (e.currentTarget.style.opacity = "1");

const SubscriptionNotice = () => {
  return (
    <div
      style={{
        display: "inline-block",
        marginBottom: rhythm(2),
        padding: rhythm(1),
        border: "1px solid",
        borderColor: "var(--border-color, currentColor)",
        borderRadius: "6px",
        backgroundColor: "var(--bg-color, transparent)",
        opacity: 0.95,
      }}
    >
      <p style={{ margin: 0, marginBottom: rhythm(0.5), fontWeight: 500 }}>
        Get notified of new blog posts?
      </p>
      <div style={{ display: "flex", gap: rhythm(0.5), flexWrap: "wrap" }}>
        {buttons.map(({ href, Icon, text }) => (
          <Link
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {text}
            <Icon size={18} />
          </Link>
        ))}
      </div>
      <p style={{ margin: 0, marginTop: rhythm(0.5), fontSize: "0.8em" }}>
        RSS is the <Link href="/blog/why-i-love-rss/">correct choice</Link>,
        btw.
      </p>
    </div>
  );
};

export default SubscriptionNotice;
