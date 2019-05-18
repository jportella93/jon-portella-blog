import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

function Bio() {

  const [ containerStyle, setContainerStyle ] = React.useState({
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    marginBottom: rhythm(2.5),
  })

  React.useEffect(() => {
    if (window.innerWidth > 450) {
      setContainerStyle({
        ...containerStyle,
        flexDirection: `row`,
        alignItems: `initial`
      })
    }
  }, [])

  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
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
                borderRadius: `100%`,
              }}
            />
            <div style={{
              display: `flex`
            }}>
              <p style={{
                margin: `auto 0`
              }}>
                Written by <strong>{author}</strong>.<br />
                {` `}
                <a href="http://bit.ly/jportella-twitter">
                  Twitter
                </a>
                {` `}
                <a href="http://bit.ly/jportella-github">
                  GitHub
                </a>
                {` `}
                <a href="http://bit.ly/jportella-linkedin">
                  LinkedIn
                </a>
              </p>

            </div>
          </div>
        )
      }}
    />
  )
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
`

export default Bio
