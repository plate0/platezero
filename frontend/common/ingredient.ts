import { IngredientLineJSON } from '../models'
import { fraction } from './fraction'
import { unitfy } from './unit'

// get the number
// get the unit, if known
// next part before ',' is name
// anything else is preparation
// 'optional' signals optional
export const parse = (s?: string): IngredientLineJSON | undefined => {
  if (!s) {
    return undefined
  }
  const numMatch = /(^[½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒\d\/\d\s.]*)/gm.exec(s)
  const num = fraction(numMatch && numMatch[1] ? numMatch[1].trim() : '1')
  if (numMatch) {
    s = s.substring(numMatch[1].length)
  }
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
    quantity_numerator: num.n,
    quantity_denominator: num.d,
    preparation: preparation ? preparation.trim() : undefined,
    optional: optional,
    unit
  }
}
