import React from 'react';
import Layout from '../components/Layout';
import Bio from '../components/Bio';
import SEO from '../components/SEO';
import App from '../components/specific/InstagramCommentPickerApp';
import { rhythm } from '../lib/typography';

const siteMetadata = {
  title: 'Jon Portella - Full Stack Developer',
};

export default function FreeInstagramRandomCommentPicker() {
  return (
    <Layout>
      <SEO
        title="Free Instagram Random Comment Picker"
        keywords={['free', 'instagram', 'random', 'comment', 'picker', 'prize', 'select', 'winner', 'picture', 'contest', 'raffle', 'giveaway']}
      />
      <hr style={{ marginBottom: rhythm(2) }} />
      <App />
      <Bio writtenByText />
    </Layout>
  );
}

