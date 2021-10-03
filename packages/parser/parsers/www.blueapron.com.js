const moment = require('moment')
const { parseAmount, parseUnit } = require('ingredient-parser')
const TurndownService = require('turndown')
const { dom, mapValues } = require('../src')

const title = ($) => $('.ba-recipe-title h1')[0].children[0].data.trim()

const subtitle = ($) => $('.ba-recipe-title h2').text().trim()

const description = ($) => $('[itemprop="description"]').text().trim()

const image_url = ($) => $('.ba-hero-image img').prop('src')

const getYield = ($) => $('[itemprop="recipeYield"]').text() + ' servings'

const duration = ($) =>
  moment.duration($('[itemprop="totalTime"]').attr('content')).asSeconds()

const preheats = ($) => {
  const regex = /preheat to (\d+).([FC])/gm
  const str = $('.section-recipe.recipe-instructions').text()
  const preheats = []
  let m
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    preheats.push({
      name: 'oven',
      temperature: parseInt(m[1]),
      unit: m[2],
    })
  }
  return preheats
}

const ingredient_lists = ($) => [
  {
    name: undefined,
    image_url: $('.section-recipe.recipe-ingredients img').attr('src'),
    lines: $('.section-recipe.recipe-ingredients ul li')
      .map(function () {
        const amount = $(this).find('span').first().text().trim()
        const name = $(this)
          .text()
          .trim()
          .replace(new RegExp(`^${amount}`), '')
          .trim()
        const [quantity, unit] = amount.replace(/\n/gm, ' ').split(' ')
        const f = parseAmount(quantity)
        return {
          name,
          quantity_numerator: f.n,
          quantity_denominator: f.d,
          preparation: undefined,
          optional: false,
          unit: parseUnit(unit),
        }
      })
      .get(),
  },
]

const procedure_lists = ($) => {
  const turndown = new TurndownService()
  return [
    {
      name: undefined,
      lines: $('.section-recipe.recipe-instructions .step.row .col-md-6')
        .map(function () {
          return {
            image_url: $(this).find('img').first().prop('src'),
            title: $(this).find('.step-title').first().text().trim(),
            text: turndown
              .turndown($(this).find('.step-txt').first().html())
              .trim(),
          }
        })
        .get(),
    },
  ]
}

module.exports = dom(
  mapValues({
    title: title,
    subtitle: subtitle,
    description: description,
    image_url: image_url,
    yield: getYield,
    duration: duration,
    preheats: preheats,
    ingredient_lists: ingredient_lists,
    procedure_lists: procedure_lists,
  })
)

module.exports._meta = {
  hostnames: ['www.blueapron.com', 'dlink.blueapron.com'],
}
