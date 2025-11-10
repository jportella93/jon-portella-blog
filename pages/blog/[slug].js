import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Bio from '../../components/Bio';
import BlogLayout from '../../components/BlogLayout';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { getAllPostsMetadata } from '../../lib/getAllPosts';
import { getPostBySlug } from '../../lib/markdown';
import { rhythm, scale } from '../../lib/typography';
import { siteMetadata } from '../../lib/siteMetadata.js';

export default function BlogPost({ post, previous, next }) {
  const router = useRouter();
  const { title: postTitle, spoiler, date } = post.frontmatter;
  const postUrl = siteMetadata.siteUrl + router.asPath;

  const postDescriptionMetaTag = `${spoiler} - ${siteMetadata.title} - ${siteMetadata.description}`;

  const [imageUrl, setImageUrl] = React.useState('');
  
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const img = document.querySelector('img');
      if (img) {
        setImageUrl(img.src);
      }
    }
  }, []);

  // Remove the first h1 tag from content if it exists (to avoid duplication with the title from frontmatter)
  const contentWithoutFirstH1 = React.useMemo(() => {
    if (!post.content) return post.content;
    // Remove the first <h1>...</h1> tag and any surrounding whitespace/newlines from the content
    return post.content.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, '');
  }, [post.content]);

  return (
    <Layout maxWidth={rhythm(22)}>
      <BlogLayout>
        <SEO 
          title={postTitle} 
          description={postDescriptionMetaTag} 
          url={postUrl} 
          image={imageUrl} 
          type="article" 
          publishedTime={date} 
        />
        <h1>{postTitle}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {date ? moment(date).format('MMMM DD, YYYY') : ''}
        </p>
        <div dangerouslySetInnerHTML={{ __html: contentWithoutFirstH1 }} />
        <form
          style={{
            maxWidth: '450px',
            margin: `${rhythm(3)} auto`,
            border: `2px solid #358ccb`,
            borderRadius: '8px',
            padding: `${rhythm(1.5)} ${rhythm(1)}`,
          }}
          action="https://buttondown.email/api/emails/embed-subscribe/jportella93"
          method="post"
          target="popupwindow"
          onSubmit={(e) => {
            e.preventDefault();
            window.open('https://buttondown.email/jportella93', 'popupwindow');
            e.target.submit();
          }}
          className="embeddable-buttondown-form"
        >
          <label 
            htmlFor="bd-email"
            style={{
              display: 'block',
              marginBottom: rhythm(1),
              ...scale(0),
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            Did you find this interesting?<br/>
            Drop your email and I'll let you know the next time I write!
          </label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: rhythm(0.75),
          }}>
            <input 
              type="email" 
              name="email" 
              id="bd-email"
              placeholder="Enter your email"
              required
              style={{
                padding: `${rhythm(0.5)} ${rhythm(0.75)}`,
                border: `1px solid #2B303A`,
                borderRadius: '4px',
                fontSize: scale(0).fontSize,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#358ccb';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2B303A';
              }}
            />
            <input type="hidden" value="1" name="embed" />
            <input 
              type="submit" 
              value="Subscribe" 
              style={{
                padding: `${rhythm(0.5)} ${rhythm(1)}`,
                border: `2px solid #358ccb`,
                borderRadius: '4px',
                background: 'transparent',
                color: '#358ccb',
                fontSize: scale(0).fontSize,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#358ccb';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#358ccb';
              }}
            />
          </div>
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
              <Link href={`/blog/${previous.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link href={`/blog/${next.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </BlogLayout>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getAllPostsMetadata();
  
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const posts = getAllPostsMetadata();
  
  const postIndex = posts.findIndex((p) => p.slug === post.slug);
  const previous = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const next = postIndex > 0 ? posts[postIndex - 1] : null;

  return {
    props: {
      post,
      previous,
      next,
    },
  };
}

