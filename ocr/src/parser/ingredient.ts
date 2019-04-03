import { IngredientLineJSON } from '../models'
import { fraction } from './fraction'
import { unitfy } from './unit'
import { trim } from 'lodash'

// get the number
// get the unit, if known
// next part before ',' is name
// anything else is preparation
// 'optional' signals optional
export const parse = (s?: string): IngredientLineJSON | undefined => {
  if (!s) {
    return undefined
  }
  const numMatch = /(^[½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒\d\/\d\s.]*)/gim.exec(s)
  // See parse 8 test
  const numMatchDash = /(^[½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒\d\/\d\s.]*-[a-z])/gim.exec(s)
  let amount = numMatch && numMatch[1] ? numMatch[1].trim() : undefined
  if (amount && numMatchDash && numMatchDash[1]) {
    amount = trim(numMatchDash[1].replace(/(\d+-[a-z]$)/, ''))
  }
  const num = amount ? fraction(amount) : undefined
  if (amount) {
    s = trim(s.substring(amount.length))
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
    quantity_numerator: num ? num.n : undefined,
    quantity_denominator: num ? num.d : undefined,
    preparation: preparation ? preparation.trim() : undefined,
    optional: optional,
    unit
  }
}
