const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

module.exports = withTypescript(
  withSass({
    serverRuntimeConfig: {
      api: {
        url: process.env.API_URL
      }
    },
    publicRuntimeConfig: {
      api: {
        url: process.env.API_URL
      }
    }
  })
)
