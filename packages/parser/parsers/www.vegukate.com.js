const { trim } = require('lodash')
const { parseIngredient } = require('ingredient-parser')
const { where } = require('../src')

exports.yield = ($) =>
  $('[itemprop="recipeInstructions"] h3').first().next('p').text()

exports.ingredient_lists = ($) => [
  {
    lines: $('[itemprop="recipeInstructions"] h3')
      .first()
      .next('p')
      .next('p')
      .text()
      .split('\n')
      .map(parseIngredient),
  },
]

exports.procedure_lists = ($) => [
  {
    lines: $('[itemprop="recipeInstructions"] h3')
      .filter(where($, /Method:/))
      .nextUntil('h3')
      .map((_, e) => ({ text: trim($(e).text()) }))
      .get(),
  },
]
