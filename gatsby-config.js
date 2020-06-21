require("dotenv").config({
  path: `.env`,
})
const { formatTitleForURL } = require("./src/utils/formatTitleForURL")
const EmploymentHistory = require("./src/data/timeline.json")
const currentJob = EmploymentHistory[0]

const dynamicPlugins = []

if (
  process.env.GUESS_EMAIL &&
  process.env.GUESS_PRIVATE_KEY &&
  process.env.VIEW_ID
) {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 3)
  dynamicPlugins.push({
    resolve: `gatsby-plugin-guess-js`,
    options: {
      GAViewID: process.env.VIEW_ID,
      jwt: {
        client_email: process.env.GUESS_EMAIL,
        private_key: process.env.GUESS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      period: {
        startDate,
        endDate: new Date(),
      },
    },
  })
  dynamicPlugins.push({
    resolve: `gatsby-source-google-analytics-reporting-api`,
    options: {
      email: process.env.GUESS_EMAIL,
      key: process.env.GUESS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      viewId: process.env.VIEW_ID,
      startDate: `2019-09-01`,
    },
  })
}

module.exports = {
  siteMetadata: {
    title: `SLD | Sam Larsen-Disney`,
    description: `Sam Larsen-Disney | ${currentJob.role} working @ ${currentJob.company}.`,
    author: `@sld`,
    siteUrl: `https://sld.codes`,
    currentRole: currentJob.role,
    currentCompany: currentJob.company,
    currentCompanyURL: currentJob.url,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-meta-redirect`,
    `gatsby-plugin-preact`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyzer`,
      options: {
        disable: true,
      },
    },
    {
      resolve: `gatsby-source-npm-author-packages`,
      options: {
        maintainer: `slarsendisney`,
      },
    },
    {
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
      options: {
        siteUrl: `https://sld.codes`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://sld.codes",
        sitemap: "https://sld.codes/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-transition-link`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        whitelist: ["pre", "dark-mode", "slick-slide", "pres-layout"], // Don't remove this selector
        ignore: [
          "src/styles/timeline.scss",
          "src/styles/layout.scss",
          "src/styles/presentations.scss",
          "src/styles/colors.scss",
        ], // Ignore files/folders
        purgeOnly: ["./src/styles"], // Purge only these files/folders
      },
    },
    {
      resolve: "gatsby-plugin-use-dark-mode",
      options: {
        classNameDark: "dark-mode",
        classNameLight: "light-mode",
        storageKey: "darkMode",
        minify: true,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-mdx`,
      extensions: [".mdx", ".md"],
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-images-medium-zoom`,
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-images`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
        plugins: [`gatsby-remark-images`, `gatsby-remark-images-medium-zoom`],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-images`],
      },
    },

    {
      resolve: `gatsby-source-github-profile`,
      options: {
        token: process.env.GITHUB_PROFILE_BEARER_TOKEN,
        username: "slarsendisney",
      },
    },
    {
      resolve: "gatsby-plugin-mailchimp",
      options: {
        endpoint:
          "https://codes.us4.list-manage.com/subscribe/post?u=0cf960d42e04bd50f7c21d709&amp;id=35a0b97fdb",
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `stats`,
        path: `${__dirname}/data/stats/count_total.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/nav-sections.json`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mdx-pages",
        path: `${__dirname}/MDX/Articles`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mdx-pages",
        path: `${__dirname}/MDX/Bio`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mdx-pages",
        path: `${__dirname}/MDX/Boilerplates`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mdx-pages",
        path: `${__dirname}/MDX/Projects`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mdx-pages",
        path: `${__dirname}/MDX/Quibs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-sentry",
      options: {
        dsn: "https://e95ebaa6275f4e81bb4ed1d66e102991@sentry.io/2687811",
        environment: process.env.NODE_ENV,
        enabled: (() =>
          ["production", "stage"].indexOf(process.env.NODE_ENV) !== -1)(),
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Sam Larsen-Disney",
        short_name: "SLD",
        start_url: "/",
        background_color: "#ea4e68",
        theme_color: "#2e4052",
        display: "standalone",
        icon: `src/images/favicon.png`,
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: [`title`, `desc`],
        resolvers: {
          Mdx: {
            title: (node) => node.frontmatter.title,
            type: (node) => node.frontmatter.type,
            desc: (node) => node.frontmatter.desc,
            path: (node) =>
              node.frontmatter.type === "Article"
                ? "articles/" + formatTitleForURL(node.frontmatter.title)
                : node.frontmatter.path,
          },
          NavSectionsJson: {
            title: (node) => node.label,
            type: () => "Page",
            desc: (node) => node.desc,
            path: (node) => node.url,
          },
        },
        filter: (node, getNode) => {
          if (node.frontmatter) {
            if (
              node.frontmatter.type === "Q&A" ||
              node.frontmatter.type === "BIO"
            ) {
              return false
            }
          }

          return true
        },
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.FIREBASE_DB_URL,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_SB,
          messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-26978781-2",
        head: false,
      },
    },
    {
      resolve: `gatsby-theme-mdx-deck`,
      options: {
        contentPath: `MDX/Decks`,
        basePath: `/decks`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        appendScript: require.resolve(`./src/custom-sw-code`),
      },
    },
  ].concat(dynamicPlugins),
}
