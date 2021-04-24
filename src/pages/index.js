import { graphql } from 'gatsby'
import React from 'react'
import Fade from 'react-reveal/Fade';
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Stickyroll } from '@stickyroll/stickyroll';

const content = [
  {
    title: "Hello, there",
    subtitle: ""
  },
  {
    title: "I'm Jon Portella,",
    subtitle: "A Full Stack Developer from Vancouver, Canada."
  },
  {
    title: "Welcome to my website!",
    subtitle: "Check my work and contact info at the top."
  }
]


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Stickyroll pages={content}>
        {({ page, pageIndex, pages, progress }) => {
          const { title, subtitle } = content[pageIndex]
          return (
            <Layout location={this.props.location} title={siteTitle}>
              <SEO
                title="Home"
                keywords={[`blog`, `gatsby`, `javascript`, `react`]}
              />
              <div style={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Fade bottom opposite when={pageIndex === 0 || (progress > 0.2 && progress < 0.8)}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    {title && <h1 style={{ fontSize: '3rem' }}>{title}</h1>}
                    {subtitle && <h3 style={{ fontSize: '1.5rem' }}>{subtitle}</h3>}
                  </div>
                </Fade>
              </div>
            </Layout>
          );
        }}
      </Stickyroll>
    )
  }
}

export default Index

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
