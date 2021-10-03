const url = require('url')
const axios = require('axios')
const { size, keys, pick, isFunction } = require('lodash')
const Default = require('./default')
const { RecipeError } = require('./errors')
const { parser } = require('./parser')
const { validKeys } = require('./html')

export const parse = async (url: string) => {}

const parse = async (urlString) => {
  const { hostname } = url.parse(urlString)
  const Parsers = require('../parsers')
  let p = Parsers[hostname] || Default
  const fetch = p.fetch || axios.get
  const { data } = await fetch(urlString, {})
  const recipe = parser(
    isFunction(p) ? p : isFunction(p.parse) ? p.parse : pick(p, keys(validKeys))
  )(data, { urlString })
  if (
    !recipe.title ||
    !size(recipe.ingredient_lists) ||
    !size(recipe.procedure_lists)
  ) {
    throw new RecipeError('invalid recipe', recipe)
  }
  recipe.yield = recipe.yield
    ? recipe.yield.trim().replace(/^(\d+)$/, 'Serves  $1')
    : recipe.yield
  return recipe
}

module.exports = {
  parse
}
