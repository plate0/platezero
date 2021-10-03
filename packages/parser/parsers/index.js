const { readdirSync } = require('fs')
const { parse } = require('path')

const Parsers = {}

readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      !file.match(/\.test\.js$/)
  )
  .map((f) => [parse(f), f])
  .forEach(([{ name }, f]) => {
    const parser = require(`./${f}`)
    const meta = parser._meta
    if (meta && meta.hostnames) {
      meta.hostnames.forEach((h) => (Parsers[h] = parser))
    } else {
      Parsers[name] = parser
    }
  })

module.exports = Parsers
