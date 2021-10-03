const moment = require('moment')
const { description } = require('../src')

exports.yield = ($) =>
  $('ul.recipe-time-yield li').first().find('span').last().text().trim()

exports.description = ($) =>
  description($('[itemprop="description"] p').first())($)

exports.duration = ($) =>
  moment.duration($('meta[itemprop="cookTime"]').attr('content')).asSeconds()

exports.preheats = '.recipe-steps'
exports.ingredient_lists =
  'ul.recipe-ingredients li[itemprop="recipeIngredient"]'
exports.procedure_lists = 'ol.recipe-steps li'
