const { parseIngredient } = require('ingredient-parser')
const moment = require('moment')
const _ = require('lodash')
const cheerio = require('cheerio')
const TurndownService = require('turndown')
const { duration } = require('./duration')

const findMap = ($, options) => {
  const opts = _.defaults(options, {
    selector: '*',
  })
  return $(opts.selector)
    .filter(function () {
      if (opts.css) {
        return ($(this).attr('class') || '').match(opts.css)
      }
      if (opts.id) {
        return ($(this).attr('id') || '').match(opts.id)
      }
      return true
    })
    .map(function () {
      return opts.map.apply(this, arguments)
    })
    .get()
}

const where = ($, r) => (_i, e) => $(e).text().match(r)

const text = (sel) => ($) => _.trim($(sel).text())

const title = (sel) => {
  if (sel) {
    return text(sel)
  }
  return ($) => {
    let title = _.trim(
      $('meta[name="twitter:title"]').attr('content') ||
        $('meta[property="twitter:title"]').attr('content')
    )
    if (title) {
      return title
    }
    title = _.trim($('meta[property="og:title"]').attr('content'))
    if (title) {
      return title
    }
    return text('title')($)
  }
}

const description = (sel) => {
  if (sel) {
    return text(sel)
  }
  return ($) => {
    let description = _.trim(
      $('meta[property="twitter:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content')
    )
    if (description) {
      return description
    }
    description = _.trim($('meta[property="og:description"]').attr('content'))
    if (description) {
      return description
    }
    description = _.trim($('meta[itemprop="description"]').attr('content'))
    if (description) {
      return description
    }
    return undefined
  }
}

const image_url = (sel) => ($) => {
  if (sel) {
    let x = $(sel).attr('src')
    return x
  }
  let image =
    $('meta[property="twitter:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('meta[property="og:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('article img').first().attr('src')
  if (image) {
    return image
  }
  return $('main img').first().attr('src')
}

// https://regex101.com/r/xqkIKF/1
const preheats = (sel) => ($) => {
  const utilities = ['oven', 'sous vide', 'stove']
  const regex = new RegExp(
    `(${utilities.join('|')})\\s[a-z]*\\s?(\\d+)\\s?(degrees|º|°)?\\s?(C|F)?`,
    'gim'
  )
  let preheats = []
  let m
  const text = _.trim(sel ? $(sel).text() : $.text())
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    preheats.push({
      name: m[1],
      temperature: parseInt(m[2]),
      unit: _.upperCase(m[4]) || 'F', //TODO: Default to user preference?
    })
  }
  preheats = _.uniqBy(preheats, 'name')
  return preheats
}

/* Ingredient List Strategies */
function ingredientMapper($) {
  return function () {
    return parseIngredient(_.trim($(this).text()))
  }
}

// 1. https://schema.org/Recipe
// Search for well known paths
const recipeSchemaIngredientLists = ($) => {
  const search = [
    // https://schema.org/Recipe
    { selector: '[itemprop="recipeIngredient"]' },
    // https://easyrecipeplugin.com/
    { selector: 'li[itemprop="ingredients"]' },
    { selector: 'ul li', css: /ingredient/i },
    // https://www.wptasty.com/tasty-recipes
    { selector: 'div.tasty-recipes-ingredients ul li' },
  ]
  for (let s of search) {
    const found = findMap($, {
      ...s,
      ...{ map: ingredientMapper($) },
    })
    if (found.length > 1) {
      return found
    }
  }
  return []
}

// 2. PlateZero::thing
// TODO: will probably remove
const plateZeroIngredientLists = ($) => {
  const lines = $('*')
    .filter(function () {
      return /^ingredients$/gim.test($(this).text().trim())
    })
    .first()
    .next()
    .closest('ul')
    .find('li')
    .map(function () {
      return parseIngredient($(this).text())
    })
    .get()
  return lines
}

const ingredient_lists = (sel) => ($) => [
  {
    lines: $(sel)
      .map(function () {
        return parseIngredient(_.trim($(this).text()))
      })
      .get(),
  },
]

function procedureMapper($) {
  return function () {
    return { text: _.trim($(this).text()) }
  }
}

// Search for well known paths
const recipeSchemaProcedureLists = ($) => {
  const search = [
    { selector: 'ol[itemprop="recipeInstructions"] li' },
    { selector: 'ol li', css: /instruction/i },
    { selector: ':not([itemscope])[itemprop="recipeInstructions"]' },
    {
      selector: '[itemprop="recipeInstructions"] [itemprop="itemListElement"]',
    },
    {
      selector: '[itemprop="recipeInstructions"] [itemprop="text"]',
    },
    // Seriously, people?
    { selector: 'ul li', css: /instruction/i },
    // https://www.wptasty.com/tasty-recipes
    { selector: 'div.tasty-recipes-instructions ol li' },
  ]
  for (let s of search) {
    const found = findMap($, {
      ...s,
      ...{ map: procedureMapper($) },
    })
    // Maybe 1?
    if (found.length > 0) {
      return found
    }
  }
  return []
}

// 2. PlateZero Custom
const plateZeroProcedureLists = ($) => {
  const lines = $('*')
    .filter(function () {
      return /^instructions$/gim.test($(this).text().trim())
    })
    .first()
    .next()
    .closest('ol')
    .find('li')
    .map(function () {
      return { text: $(this).text() }
    })
    .get()
  return lines
}

const procedure_lists = (sel) => ($) => {
  const turndown = new TurndownService()
  return [
    {
      lines: $(sel)
        .map(function () {
          return {
            text: turndown.turndown($(this).html()),
          }
        })
        .get(),
    },
  ]
}

const recipeSchemaYield = ($) => {
  const node = $('[itemprop="recipeYield"]')
  const y = node.text() || node.attr('content')
  if (_.isNil(y)) {
    return undefined
  }
  if (_.isString(y)) {
    return y
  }
  if (_.isArray(y)) {
    return y[0]
  }
  return undefined
}

// Master List Of Keys And Default Values, must include all valid keys
const masterListOfKeysAndDefaults = {
  title,
  description: description(),
  image_url: image_url(),
  preheats: preheats(),
  ingredient_lists: ($) => {
    let lines = recipeSchemaIngredientLists($)
    if (lines.length !== 0) {
      return [{ lines }]
    }
    return undefined
  },
  procedure_lists: ($) => {
    let lines = recipeSchemaProcedureLists($)
    if (lines.length > 0) {
      return [{ lines }]
    }
    return undefined
  },
  yield: recipeSchemaYield,
  subtitle: undefined,
  source_url: undefined,
  source_author: undefined,
  source_title: undefined,
  source_isbn: undefined,
  duration: undefined,
}

// Default values
const defaults = _.pickBy(
  masterListOfKeysAndDefaults,
  (val) => val != undefined
)

// All valid keys
const validKeys = _.keys(masterListOfKeysAndDefaults)

module.exports = {
  text,
  title,
  description,
  defaults,
  duration,
  image_url,
  ingredient_lists,
  procedure_lists,
  preheats,
  recipeSchemaYield,
  recipeSchemaIngredientLists,
  recipeSchemaProcedureLists,
  plateZeroProcedureLists,
  plateZeroIngredientLists,
  validKeys,
  where,
}
