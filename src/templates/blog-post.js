import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import Bio from '../components/Bio'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import moment from 'moment';

const BlogPostTemplate = ({ data, location, pageContext }) => {
  const { html: postHtml, frontmatter } = data.markdownRemark;
  const { title: postTitle, spoiler, date } = frontmatter;

  const { title: siteTitle, description: siteDescription, siteUrl } = data.site.siteMetadata
  const postUrl = siteUrl + location.pathname;

  const postDescriptionMetaTag = `${spoiler} - ${siteTitle} - ${siteDescription}`

  const { previous, next } = pageContext

  // TODO: Pass image URL directly into SEO component rather than doing this trick.
  const [ imageUrl, setImageUrl ] = React.useState('');
  React.useEffect(() => {
    setImageUrl(document.querySelector('img').src)
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={postTitle} description={postDescriptionMetaTag} url={postUrl} image={imageUrl} type={"article"} publishedTime={date} />
      <h1>{postTitle}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {moment(date).format('MMMM DD, YYYY')}
      </p>
      <div dangerouslySetInnerHTML={{ __html: postHtml }} />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
              </Link>
          )}
        </li>
      </ul>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        description
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        spoiler
      }
    }
  }
`
