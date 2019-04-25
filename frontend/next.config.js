const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

module.exports = (config, { defaultConfig }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return withTypescript(
    withSass({
      env: {
        cookie: {
          expires: 365,
          secure: isProd,
          samesite: 'strict'
        }
      },
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
}
