module.exports = {
  siteMetadata: {
    title: `Jon Portella - Full Stack Developer`,
    author: `Jon Portella`,
    description: `Welcome to my website! Here you'll find articles and resources written by a Full Stack Developer.`,
    siteUrl: `https://jonportella.com`,
    social: {
      twitter: `jportella93`
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-120945642-3`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jon Portella's Blog`,
        short_name: `JonPortella`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#358ccb`,
        display: `minimal-ui`,
        icon: `content/assets/alien.png`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`*`],
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-hotjar`,
      options: {
        id: 1683987,
        sv: 6
      },
    },
    // {
    //   resolve: `gatsby-plugin-github-ribbon`,
    //   options: {
    //     project: `https://github.com/jportella93/jon-portella-blog`,
    //     color: `darkblue`,
    //     position: `left`,
    //   }
    // },
    // {
    //   resolve: `@isamrish/gatsby-plugin-google-adsense`,
    //   options: {
    //     googleAdClientId: "ca-pub-2561526787962851",
    //     head: true
    //   }
    // }
  ],
}
