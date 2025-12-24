import { rhythm } from "../lib/typography";
import Kofi from "./Kofi";
import VisitCounter from "./VisitCounter";
import { EmailIcon, RssIcon } from "./icons";

const links = [
  {
    url: "mailto:jportella93@gmail.com?subject=jonportella.com%20footer%20email",
    label: "Email",
    icon: <EmailIcon />,
  },
  {
    url: "/rss.xml",
    label: "RSS",
    icon: <RssIcon />,
  },
  {
    url: "https://pinterest.com/jonportella/",
    label: "Pinterest",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: rhythm(3),
        paddingTop: rhythm(1.5),
        borderTop: "1px solid",
        borderColor: "var(--border-color, currentColor)",
        opacity: 0.7,
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          margin: `${rhythm(1)} 0`,
        }}
      >
        <ul
          style={{
            display: "flex",
            margin: 0,
            gap: rhythm(1),
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {links.map(({ label, url, icon }) => (
            <li key={url} style={{ listStyle: "none" }}>
              <a
                {...(url.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                href={url}
                aria-label={label}
                style={{
                  display: "inline-block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {icon}
              </a>
            </li>
          ))}
          <li style={{ listStyle: "none" }}>
            <Kofi />
          </li>
        </ul>
      </nav>
      <VisitCounter />
    </footer>
  );
}
