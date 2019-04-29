import * as moment from 'moment'
import { mapValues } from './importer'
import {
  Preheat,
  IngredientListJSON,
  ProcedureListJSON,
  ProcedureLineJSON
} from '../../models'
import { fraction } from '../../common/fraction'
import { unitfy } from '../../common/unit'
const TurndownService = require('turndown')

const title = ($: any) => $('.ba-recipe-title h1')[0].children[0].data.trim()

const subtitle = ($: any) =>
  $('.ba-recipe-title h2')
    .text()
    .trim()

const description = ($: any) =>
  $('[itemprop="description"]')
    .text()
    .trim()

const image_url = ($: any) => $('.ba-hero-image img').prop('src')

const getYield = ($: any) => $('[itemprop="recipeYield"]').text() + ' servings'

const duration = ($: any) =>
  moment.duration($('[itemprop="totalTime"]').attr('content')).asSeconds()

const preheats = ($: any): Preheat[] => {
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
      unit: m[2]
    })
  }
  return preheats
}

const ingredient_lists = ($: any): IngredientListJSON[] => [
  {
    name: undefined,
    image_url: $('.section-recipe.recipe-ingredients img').attr('src'),
    lines: $('.section-recipe.recipe-ingredients ul li')
      .map(function() {
        const amount = $(this)
          .find('span')
          .first()
          .text()
          .trim()
        const name = $(this)
          .text()
          .trim()
          .replace(new RegExp(`^${amount}`), '')
          .trim()
        const [quantity, unit] = amount.replace(/\n/gm, ' ').split(' ')
        const f = fraction(quantity)
        return {
          name,
          quantity_numerator: f.n,
          quantity_denominator: f.d,
          preparation: undefined,
          optional: false,
          unit: unitfy(unit)
        }
      })
      .get()
  }
]

const procedure_lists = ($: any): ProcedureListJSON[] => {
  const turndown = new TurndownService()
  return [
    {
      name: undefined,
      lines: $('.section-recipe.recipe-instructions .step.row .col-md-6')
        .map(function(): ProcedureLineJSON {
          return {
            image_url: $(this)
              .find('img')
              .first()
              .prop('src'),
            title: $(this)
              .find('.step-title')
              .first()
              .text()
              .trim(),
            text: turndown
              .turndown(
                $(this)
                  .find('.step-txt')
                  .first()
                  .html()
              )
              .trim()
          }
        })
        .get()
    }
  ]
}

export const BlueApron = mapValues({
  title: title,
  subtitle: subtitle,
  description: description,
  image_url: image_url,
  yield: getYield,
  duration: duration,
  preheats: preheats,
  ingredient_lists: ingredient_lists,
  procedure_lists: procedure_lists
})
