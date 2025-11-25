import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../lib/typography';
import { siteMetadata, getAssetPath } from '../lib/siteMetadata';

export default function Index() {
  return (
    <Layout>
      <SEO
        title="Home"
        keywords={['blog', 'javascript', 'react']}
      />
      {/* Hero Section */}
      <section style={{
        marginBottom: rhythm(3),
        paddingTop: rhythm(2),
        paddingBottom: rhythm(2),
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: rhythm(1),
        }}>
          <img
            src={getAssetPath('/assets/profile-pic.jpg')}
            alt="Jon Portella"
            width={150}
            height={150}
            style={{
              borderRadius: '50%',
              marginBottom: rhythm(0.5),
              border: '4px solid #358ccb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <h1 style={{
            ...scale(1.5),
            marginBottom: rhythm(0.5),
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            Hello, I'm Jon Portella
          </h1>
          <p style={{
            ...scale(0.5),
            color: '#666',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}>
            Software Engineer currently working at Pinterest in Toronto, Canada.
            I write about web development, JavaScript, React, and other tech topics.
          </p>
        </div>
      </section>
    </Layout>
  );
}






