import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from 'gatsby'

// import ig from 'src/'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import App from '../components/specific/InstagramCommentPickerApp'
import { rhythm } from '../utils/typography'

class FreeInstagramRandomCommentPicker extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Free Instagram Random Comment Picker"
          keywords={[`free`, `instagram`, `random`, `comment`, `picker`, `prize`, `select`, `winner`, `picture`, `contest`, `raffle`]}
        />

        <hr style={{marginBottom: rhythm(2),}}/>
        <App />
        <Bio />
      </Layout>
    )
  }
}

export default FreeInstagramRandomCommentPicker

export const pageQuery = graphql `
  query freeInstagramCommentPickerQuery {
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
