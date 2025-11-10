import React from 'react';
import Layout from '../components/Layout';
import Bio from '../components/Bio';
import SEO from '../components/SEO';

const siteMetadata = {
  title: 'Jon Portella - Full Stack Developer',
};

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Contact"
        keywords={['blog', 'javascript', 'react']}
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

