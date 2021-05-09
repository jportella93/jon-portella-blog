import { Stickyroll } from '@stickyroll/stickyroll';
import React, { useState } from 'react';
import Fade from 'react-reveal/Fade';
import Game from '../components/games/Game';
import GameContainer from '../components/games/GameContainer';
import Layout from '../components/Layout';
import SEO from '../components/seo';

const content = [
  {
    title: 'Hello, there',
    subtitle: '',
  },
  {
    title: "I'm Jon Portella,",
    subtitle: 'A Full Stack Developer from Vancouver, Canada.',
  },
  {
    title: 'Welcome to my website!',
    subtitle: 'Check my work and contact info at the top.',
  },
];

const Index = ({ location, data }) => {
  const [showGame, setShowGame] = useState(true);
  const siteTitle = data.site.siteMetadata.title;

  return (
    <>
      {showGame
        ? (
          <GameContainer>
            <Game cancelGame={() => setShowGame(false)} />
          </GameContainer>
        )
        : (
          <Stickyroll pages={content}>
            {({
              page, pageIndex, pages, progress,
            }) => {
              const { title, subtitle } = content[pageIndex];
              return (
                <Layout location={location} title={siteTitle}>
                  <button onClick={() => setShowGame(true)} type="button">🕹</button>
                  <SEO
                    title="Home"
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                  />
                  <div style={{
                    minHeight: '80vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  >
                    <Fade bottom opposite when={pageIndex === 0 || (progress > 0.2 && progress < 0.8)}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                      >
                        {title && <h1 style={{ fontSize: '3rem' }}>{title}</h1>}
                        {subtitle && <h3 style={{ fontSize: '1.5rem' }}>{subtitle}</h3>}
                      </div>
                    </Fade>
                  </div>
                </Layout>
              );
            }}
          </Stickyroll>
        )}
    </>
  );
};

export default Index;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
