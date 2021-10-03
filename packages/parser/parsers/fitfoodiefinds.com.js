const { parseIngredient } = require('ingredient-parser')
const _ = require('lodash')
const $ = require('cheerio')

exports.source_author = '.tasty-recipes-author-name'
exports.duration = '.tasty-recipes-total-time'
exports.title = '.tastywrap h2'
exports.yield = ($) => $('.tasty-recipes-yield span').first().text()
exports.image_url = ($) => $('.tasty-recipes-image img').prop('src')

exports.ingredient_lists = ($) => {
  const image_url = undefined
  const lists = []
  const headings = $('.tasty-recipe-ingredients h4')
  if ($(headings).length) {
    $(headings).each((ix, el) => {
      lists[ix] = {
        name: $(el).text(),
        lines: $(el)
          .next('ul')
          .children('li')
          .map((ix, li) => {
            return parseIngredient(_.trim($(li).text()))
          })
          .get(),
      }
    })
  } else {
    const el = $('.tasty-recipe-ingredients ul')
    lists[0] = {
      lines: $(el)
        .children('li')
        .map((ix, li) => $(li).text())
        .get(),
    }
  }
  return lists
}

exports.procedure_lists = ($) => {
  const lists = []
  const ol = $('.tasty-recipe-instructions ol')
  lists[0] = {
    lines: $(ol)
      .children('li')
      .map((ix, li) => {
        return { text: $(li).text() }
      })
      .get(),
  }
  return lists
}
