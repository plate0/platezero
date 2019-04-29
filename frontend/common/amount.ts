import * as _ from 'lodash'
import Fraction from 'fraction.js'

export const parseAmount = (text: string): [number, number, string] => {
  try {
    // first try to match a decimal
    const decResults = text.match(/^(\d*\.\d+?)/)
    if (decResults) {
      const f = new Fraction(decResults[0])
      const rest = text.substring(_.size(decResults[0]))
      return [f.n, f.d, _.trim(rest)]
    }
    // next, if no decimal was found, try to match a whole number or whole
    // number + fraction
    const results = text.match(/^((\d+\s+)?\d+(\/\d+)?)/)
    if (results) {
      const f = new Fraction(results[0])
      const rest = text.substring(_.size(results[0]))
      return [f.n, f.d, _.trim(rest)]
    }
  } catch {}
  return [undefined, undefined, _.trim(text)]
}

export const printAmount = ({
    quantity_numerator,
    quantity_denominator
  }): string | undefined  => {
    if (!quantity_numerator || !quantity_denominator) {
      return undefined
    }
    try {
      const amt = new Fraction(quantity_numerator, quantity_denominator)
      return amt.toFraction(true)
    } catch {}
    return undefined
  }

