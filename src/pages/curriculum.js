import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Line from '../components/specific/curriculum/Line';

const curriculum = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  const commonWindowStyle = {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '1rem',
    background: '#358ccb'

  }

  const bigWindowStyle = {
    line: {
      ...commonWindowStyle,
      margin: '0 auto',
    }
  }

  const smallWindowStyle = {
    line: {
      ...commonWindowStyle,
      margin: '0',
    }
  }

  const [style, setStyle] = React.useState(bigWindowStyle)

  React.useLayoutEffect(() => {
    if (window.innerWidth < 400) {
      setStyle(smallWindowStyle)
    }
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title="Curriculum Vitae"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <div style={{
        position: 'relative'
      }}>
        <div
          style={style.line} />
        <Line direction="left" date={new Date('2020-11-22')}>
          <h1>hello</h1>
        </Line>
        <Line direction="right" date={new Date('2020-11-22')}>
          <h2>How are u?</h2>
        </Line>
      </div>
    </Layout>
  );
}


export default curriculum

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
  }
`
