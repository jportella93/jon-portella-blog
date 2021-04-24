import { graphql } from 'gatsby'
import React from 'react'
import Fade from 'react-reveal/Fade';
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Stickyroll } from '@stickyroll/stickyroll';
import Bio from '../components/Bio';

class Contact extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Contact"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
              <div style={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
      <Bio writtenByText={false} />
        </div>
      </Layout>
    );
  }
}


export default Contact

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
