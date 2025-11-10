import React from 'react';
import { getAssetPath } from '../lib/siteMetadata.js';
import { rhythm } from '../lib/typography';

const siteMetadata = {
  author: 'Jon Portella',
  social: {
    twitter: 'jportella93'
  },
};

export default function Bio({ writtenByText }) {
  const [containerStyle, setContainerStyle] = React.useState({
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    marginBottom: rhythm(2.5),
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 450) {
      setContainerStyle({
        ...containerStyle,
        flexDirection: `column`,
        alignItems: `center`
      });
    }
  }, []);

  const links = [
    {
      url: "https://www.linkedin.com/in/jonportella/",
      label: "LinkedIn",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      url: "https://github.com/jportella93",
      label: "GitHub",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      url: "https://x.com/jportella93",
      label: "X (Twitter)",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      url: "https://pinterest.com/jonportella/",
      label: "Pinterest",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      )
    },
  ];

  return (
    <div style={containerStyle}>
      <img
        src={getAssetPath('/assets/profile-pic.jpg')}
        alt={siteMetadata.author}
        width={200}
        height={200}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
      />
      <div style={{ margin: `${rhythm(1)} 0`, textAlign: 'center' }}>
        {writtenByText && <p>Written by <strong>{siteMetadata.author}</strong>.<br /></p>}
        <nav style={{
          margin: `${rhythm(1)} 0`
        }}>
          <ul style={{ display: 'flex', margin: 0, gap: rhythm(1), alignItems: 'center' }}>
            {links.map(({ label, url, icon }) => (
              <li key={url} style={{ listStyle: 'none' }}>
                <a 
                  target="_blank" 
                  href={url} 
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ 
                    display: 'inline-block',
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

