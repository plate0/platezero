const { parseIngredient } = require('ingredient-parser')
const html = require('../src/html')
const { _parseDuration: parseDuration } = require('../src/duration')

exports.ingredient_lists = ($) => {
  let lines = []
  $('.ingredients-list__item').each((i, e) => lines.push($(e).attr('content')))
  if (lines.length !== 0) {
    return [{ lines: lines.map((line) => parseIngredient(line)) }]
  }
  console.log(`\x1b[93;41mNo elements found\x1b[0m`)
  return undefined
}

exports.duration = ($) => {
  let prep = parseDuration($('.recipe-details__cooking-time-prep span'))
  let cook = parseDuration($('.recipe-details__cooking-time-cook span'))
  return (prep ? prep : 0) + (cook ? cook : 0) || undefined
}
