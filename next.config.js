const withSass = require('@zeit/next-sass')
const withMDX = require('@zeit/next-mdx')({
  extension: /.mdx$/,
  options: {}
})

module.exports = (config, { defaultConfig }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return withMDX(
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
        },
        www: {
          url: process.env.SITE_URL
        }
      },
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
    })
  )
}
