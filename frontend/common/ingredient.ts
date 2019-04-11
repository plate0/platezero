import * as _ from 'lodash'
import { IngredientLineJSON } from '../models'
import { fraction } from './fraction'
import { unitfy } from './unit'
import { trim } from 'lodash'

// matchNumber returns a pair consisting of
// - a quantity, or { n: undefined, d: undefined } if not found, and
// - the remainder of the string to be parsed by subsequent logic
const matchNumber = (
  s: string
): [{ n: number | undefined; d: number | undefined }, string] => {
  // matches three general parts:
  // 1. the numerator or whole number or decimal
  // 2. a unicode fraction
  // 3. a fraction using / or just the denominator from (1)
  const p = /^(\s*\d*(\.\d+)?\s*([½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]?)((\d*\s*)?\/\s*\d*)?)/gm
  const match = p.exec(s)
  if (match) {
    try {
      return [fraction(match[1]), s.substring(match[1].length)]
    } catch {
      // fall through to default
    }
  }
  return [{ n: undefined, d: undefined }, s]
}

// get the number
// get the unit, if known
// next part before ',' is name
// anything else is preparation
// 'optional' signals optional
export const parse = (s?: string): IngredientLineJSON | undefined => {
  if (!s) {
    return undefined
  }
  const [num, numRest] = matchNumber(s)
  s = _.trim(numRest)
  const [maybeUnit, ...rest] = s.split(/\s/)
  const unit = unitfy(maybeUnit)
  if (unit) {
    s = rest.join(' ')
  }
  let [name, ...restPrep] = s.split(',')
  const optional = /optional/i.test(s)
  name = name.trim()
  const preparation = restPrep.join(',').trim()
  return {
    name: name.trim(),
    quantity_numerator: num ? num.n : undefined,
    quantity_denominator: num ? num.d : undefined,
    preparation: preparation ? preparation.trim() : undefined,
    optional: optional,
    unit
  }
}
