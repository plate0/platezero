/*
 * This is really old-style HTML with few, if any, 'id' or 'class' attributes.
 * Notes on input format:
 *  1. The whole recipe is contained within the single <td> of the single <tr> of a <table>
 *  2. The parsing depends on locating elements set around the <ul> which contains the ingredients
 *  3. The title, source, and yield are located in <p> tags before the <ul>
 *  4. The procedures follow the <ul>, but are in a mixture of
 *      a) 'text' of the <td>
 *      b) <p> tags
 */
const { parseAmount, parseUnit } = require('ingredient-parser')
const TurndownService = require('turndown')
const rxAmount = /^[0-9/ ½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]+/

exports.title = ($) =>
  $('table table p font')[0]
    .children[0] // text
    .data.trim()
    .replace(/\s+/, ' ')

exports.source_author = ($) =>
  $('table table p font')[1]
    .children[0] // text
    .data.trim()
    .replace(/^from: /i, '')

exports.yield = ($) =>
  $('table table p:nth-of-type(2)')[0]
    .children[0] // text
    .data.trim()

exports.ingredient_lists = ($) => [
  {
    name: undefined,
    image_url: undefined,
    lines: $('table table ul li')
      .map(function () {
        let rest = $(this).text().trim()
        let name, quantity_numerator, quantity_denominator, unit
        const hasAmount = rest.match(rxAmount)
        if (hasAmount) {
          const quantity = hasAmount[0]
          const f = parseAmount(quantity)
          quantity_numerator = f.n
          quantity_denominator = f.d
          rest = rest.substring(quantity.length).trim()
          const haveUnit = rest.match(/\S+/)
          if (haveUnit) {
            unit = parseUnit(haveUnit[0])
            if (unit) {
              rest = rest.substring(haveUnit[0].length).trim()
            }
          }
        }

        name = rest
        return {
          name,
          quantity_numerator,
          quantity_denominator,
          preparation: undefined,
          optional: false,
          unit,
        }
      })
      .get(),
  },
]

exports.procedure_lists = ($) => {
  const turndown = new TurndownService()
  let ulIndex
  const td = $('table table td').clone()
  // Remove child elements up to and including 'ul'
  td.children().each(function (index, element) {
    if (element.type == 'tag') {
      let name = element.name
      if (name == 'ul') {
        ulIndex = index
        return false
      }
    }
  })
  while (ulIndex >= 0) {
    td.children().remove(':nth-child(' + (1 + ulIndex--) + ')')
  }
  let html = td.html() + td.children().html()
  let lines = turndown
    .turndown(html)
    .split('\n')
    .filter((line) => line.trim().length > 0)
  return [
    {
      name: undefined,
      lines: lines.map((line) => {
        return {
          image_url: undefined,
          title: undefined,
          text: line.trim(),
        }
      }),
    },
  ]
}
