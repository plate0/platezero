const moment = require('moment')
const { last } = require('lodash')

exports.duration = ($) => {
  const txt = $(
    '.recipe-meta-container .recipe-meta-item .recipe-meta-item-body'
  )
    .first()
    .text()
    .trim()
  const time = parseInt(txt)
  const unit = last(txt.split(/\s+/)).charAt(0).toLowerCase()
  const dur = moment.duration(time, unit)
  return dur.isValid() ? dur.asSeconds() : undefined
}

exports.yield = ($) =>
  $('.recipe-meta-container .recipe-meta-item .recipe-meta-item-body')
    .last()
    .text()
    .trim()

exports.ingredient_lists = '.recipe-ingredients ul li'
exports.procedure_lists = '.recipe-instructions .step p'
