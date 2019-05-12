//import * as moment from 'moment'
import { mapValues } from './importer'
import {
  //  Preheat,
  IngredientListJSON
  //  ProcedureListJSON,
  //  ProcedureLineJSON
} from '../../models'
import { parseAmount, parseUnit } from 'ingredient-parser'
//const TurndownService = require('turndown')

const rxAmount = /^[0-9/ ½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]+/
		
const title = ($: any) =>
  $('table table p font')[0]
    .children[0] // text
    .data.trim()
    .replace(/\s+/, ' ')

const source_author = ($: any) =>
  $('table table p font')[1]
    .children[0] // text
    .data.trim()
    .replace(/^from: /i, '')

const getYield = ($: any) =>
  $('table table p:nth-of-type(2)')[0]
    .children[0] // text
    .data.trim()
    .replace(/^[\w\s]+:\s/, '')

const ingredient_lists = ($: any): IngredientListJSON[] => [
  {
    name: undefined,
    image_url: undefined,
    lines: $('table table ul li')
      .map(function() {
        let line = $(this)
          .text()
          .trim()
        let name, quantity_numerator, quantity_denominator, unit

        const hasAmount = line.match(rxAmount)
        if (hasAmount) {
          const quantity = hasAmount[0]
          const f = parseAmount(quantity)
          quantity_numerator = f.n
          quantity_denominator = f.d

          line = line.substring(quantity.length).trim()
          const haveUnit = line.match(/\S+/)
          if (haveUnit) {
           unit = parseUnit(haveUnit[0])
            if (unit) {
              line = line.substring(haveUnit[0].length).trim()
            }
          }
        }

        name = line

        return {
          name,
          quantity_numerator,
          quantity_denominator,
          preparation: undefined,
          optional: false,
          unit
        }
      })
      .get()
  }
]

export const Ivu = mapValues({
  title: title,
  source_author: source_author,
  yield: getYield,
  ingredient_lists: ingredient_lists
  //  procedure_lists: procedure_lists
})
