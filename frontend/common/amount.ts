import * as _ from 'lodash'
import Fraction from 'fraction.js'
import {logger} from './logger'

export const parseAmount = (text: string): [number, number, string] => {
  try {
      logger.debug('Parsing %s', text)
    // first try to match a decimal
    const decResults = text.match(/^(\d*\.\d+?)/)
    if (decResults) {
      logger.debug('matched a decimal')
      const f = new Fraction(decResults[0])
      const rest = text.substring(_.size(decResults[0]))
      return [f.n, f.d, _.trim(rest)]
    }
    // next, if no decimal was found, try to match a whole number + fraction
    const fracResults = text.match(/^((\d+\s+)?(\d+\/\d+))/)
    if (fracResults) {
      logger.debug('matched a whole number + fraction')
      const f = new Fraction(fracResults[0])
      const rest = text.substring(_.size(fracResults[0]))
      return [f.n, f.d, _.trim(rest)]
    }
    // next, if no fraction was found, try to match a whole number
    const results = text.match(/^(\d+)/)
    if (results) {
      logger.debug('matched a whole number')
      const f = new Fraction(results[0])
      const rest = text.substring(_.size(results[0]))
      return [f.n, f.d, _.trim(rest)]
    }
  } catch (err) {logger.debug('Caught error: ', new Error(err))}
  logger.debug('no match')
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

