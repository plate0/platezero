const withSass = require('@zeit/next-sass')

module.exports = (config, { defaultConfig }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return withSass({})
}
