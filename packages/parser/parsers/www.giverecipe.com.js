const { reduce } = require('lodash')
const { parseIngredient } = require('ingredient-parser')

exports.description = '.tasty-recipes-description'

exports.yield = ($) => $('.tasty-recipes-yield > span').first().text()

exports.duration = '.tasty-recipes-total-time'

exports.ingredient_lists = ($) => {
  return $('.tasty-recipe-ingredients ul').map((idx, el) => {
    const name = $(el).prevUntil('ul', 'p').text()
    const lines = $(el)
      .find('li')
      .map(function () {
        return parseIngredient($(this).text())
      })
      .get()
    return { name, lines }
  })
}

exports.procedure_lists = '.tasty-recipe-instructions ol li'
