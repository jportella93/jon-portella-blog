import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import Bio from '../components/Bio'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import moment from 'moment';
import BlogLayout from '../components/BlogLayout'

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
      <BlogLayout>
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
        <form
          style={{
            maxWidth: '350px',
            margin: '80px auto',
            border: 'gray 2px solid',
            borderRadius: '5px',
            padding: '16px 16px',
          }}
          action="https://buttondown.email/api/emails/embed-subscribe/jportella93"
          method="post"
          target="popupwindow"
          onsubmit="window.open('https://buttondown.email/jportella93', 'popupwindow')"
          class="embeddable-buttondown-form"
        >
          <label for="bd-email">
            Did you find this interesting?<br/>
            Drop your email and I'll let you know the next time I write!<br/>
          </label>
          <input type="email" name="email" id="bd-email" />
          <input type="hidden" value="1" name="embed" />
          <input type="submit" value="Subscribe" />
        </form>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio writtenByText />
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
      </BlogLayout>
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
