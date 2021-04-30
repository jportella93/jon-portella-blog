import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

function Bio({ writtenByText }) {
  const [containerStyle, setContainerStyle] = React.useState({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: rhythm(2.5),
  });

  React.useEffect(() => {
    if (window.innerWidth > 450) {
      setContainerStyle({
        ...containerStyle,
        flexDirection: 'column',
        alignItems: 'center',
      });
    }
  }, []);

  const links = [
    {
      url: 'http://bit.ly/jportella-linkedin',
      label: 'LinkedIn',
    },
    {
      url: 'http://bit.ly/jportella-github',
      label: 'GitHub',
    },
    {
      url: 'http://bit.ly/jportella-twitter',
      label: 'Twitter',
    },
  ];

  return (
    <StaticQuery
      query={bioQuery}
      render={(data) => {
        const { author, social } = data.site.siteMetadata;
        return (
          <div
            style={containerStyle}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: '100%',
              }}
            />
            <div style={{ margin: `${rhythm(1)} 0`, textAlign: 'center' }}>
              {writtenByText && (
              <p>
                Written by
                <strong>{author}</strong>
                .
                <br />
              </p>
              )}
              <nav style={{
                margin: `${rhythm(1)} 0`,
              }}
              >
                <ul style={{ display: 'flex', margin: 0 }}>
                  {links.map(({ label, url }) => (
                    <li
                      key={url}
                      style={{ listStyle: 'none', marginRight: rhythm(1) }}
                    >
                      <a target="_blank" href={url} rel="noopener noreferrer">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 200, height: 200, quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;

export default Bio;
