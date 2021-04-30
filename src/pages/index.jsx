import { graphql } from 'gatsby';
import React from 'react';
import CatchName from '../components/games/CatchName/CatchName';
import ChooseDifficluty from '../components/games/ChooseDifficulty';
import FindInfoGame from '../components/games/FindInfoGame';
import Narrator from '../components/Narrator/Narrator';

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

const Index = () => {
  console.log('index');
  return (
    <>
      <FindInfoGame />
    </>
  // <Stickyroll pages={content}>
  //   {({ page, pageIndex, pages, progress }) => {
  //     const { title, subtitle } = content[pageIndex]
  //     return (
  //       <Layout location={this.props.location} title={siteTitle}>
  //         <SEO
  //           title="Home"
  //           keywords={[`blog`, `gatsby`, `javascript`, `react`]}
  //         />
  //         <div style={{
  //           minHeight: '80vh',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //         }}>
  //           <Fade bottom opposite when={pageIndex === 0 || (progress > 0.2 && progress < 0.8)}>
  //             <div style={{
  //               display: 'flex',
  //               justifyContent: 'center',
  //               flexDirection: 'column'
  //             }}>
  //               {title && <h1 style={{ fontSize: '3rem' }}>{title}</h1>}
  //               {subtitle && <h3 style={{ fontSize: '1.5rem' }}>{subtitle}</h3>}
  //             </div>
  //           </Fade>
  //         </div>
  //       </Layout>
  //     );
  //   }}
  // </Stickyroll>
  );
};

export default Index;
