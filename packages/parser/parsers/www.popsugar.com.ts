import { Parser } from '../src/parser'

const moment = require('moment')

exports.yield = ($) =>
  $('article.recipe section.recipe-section-information dl')
    .children()
    .filter(function () {
      return $(this).text().match(/yield/i)
    })
    .first()
    .next('dd')
    .text()
    .trim()

exports.duration = ($) => {
  const time = $('article.recipe section.recipe-section-information dl')
    .children()
    .filter(function () {
      return $(this).text().match(/time/i)
    })
    .first()
    .next('dd')
    .text()
    .trim()

  if (time) {
    return moment
      .duration(parseInt(time, 10), time.split(/\s+/)[1].charAt(0))
      .asSeconds()
  }
  return 0
}

exports.ingredient_lists = 'article.recipe section.recipe-section > ol li'
exports.procedure_lists =
  'article.recipe > div > section.recipe-section.recipe-section-directions > div > ol li'

export default {
  ...defaults
} as Parser
