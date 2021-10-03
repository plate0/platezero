const { last } = require('lodash')
const moment = require('moment')
const { parseIngredient } = require('ingredient-parser')

exports.yield = '.recipe-about .info.yield'
exports.preheats = '.recipe-procedure'

exports.description = ($) =>
  $('.recipe-introduction-body p:not(.caption)').first().text().trim()

exports.duration = ($) => {
  // parse format: 1 hour
  const dur = $('.recipe-about li:nth-child(3) .info')
    .text()
    .replace(/about/i, '')
    .trim()
  // This parses the number part quite well, actually
  const num = parseInt(dur)
  const unit = last(dur.split(/\s/))
  return moment.duration(num, unit).asSeconds()
}

exports.ingredient_lists = ($) => {
  const lists = []
  let list = undefined
  $('.recipe-ingredients ul li').each(function () {
    const el = $(this)
    if (el.find('strong').length > 0) {
      if (list) {
        lists.push(list)
      }
      list = {
        name: el.text(),
        lines: [],
      }
    } else {
      if (!list) {
        // Default list
        list = {
          name: '',
          lines: [],
        }
      }
      list.lines.push(parseIngredient(el.text()))
    }
  })
  lists.push(list)
  return lists
}

exports.procedure_lists = '.recipe-procedures ol li .recipe-procedure-text'
