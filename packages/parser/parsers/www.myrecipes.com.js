const { parseIngredient } = require('ingredient-parser')
const _ = require('lodash')
const axios = require('axios')
const adapter = require('axios/lib/adapters/http')

exports.fetch = async (url, options) => {
  let config = {
    headers: {
      Cookie:
        'euConsent=true; euConsentId=79af88de-7209-4335-8d2f-c3d328e5d812',
    },
    adapter: adapter,
  }
  _.merge(options, config)
  try {
    return await axios.get(url, options)
  } catch (err) {
    console.error(`url ${typeof url}, options ${JSON.stringify(options)}`)
    console.error(err)
  }
}

exports.description = 'div.recipe-summary div p'
exports.procedure_lists = 'div.step p'
exports.yield = 'div.recipe-meta-item-body'
exports.image_url =
  'div.recipe-content div.image-container div.inner-container img'

exports.ingredient_lists = ($) => {
  return [
    {
      name: undefined,
      image_url: undefined,
      lines: $('div.ingredients ul li')
        .map(function () {
          return parseIngredient($(this).text())
        })
        .get(),
    },
  ]
}
