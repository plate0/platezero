import * as rfc6902 from 'rfc6902'
import * as _ from 'lodash'

import { IngredientLineJSON, IngredientListJSON } from '../../models'

/**
 * Create a RFC6902 JSON patch for an edited ingredient list
 *
 * The patch generator that ships with the `rfc6902` package will try to make
 * diffs that only affect a very small part of the overall JSON document, and
 * by doing so, actually generates much larger and less-useful diffs than we
 * can trivially create ourselves.
 *
 * For example, if we remove an ingredient and add a new one, the default diff
 * algorithm will output a series of "replace" operations where the old
 * ingredient's name, quantity, etc, are all replaced with the new ingredient's
 * values. In fact, the equivalent but more meaningful representation for
 * PlateZero is to simply represent this as a "remove" operation followed by an
 * "add" operation with the value being the entire IngredientLine.
 *
 * We really only care about three things: (1) adding a new ingredient, (2)
 * removing an existing ingredient, and (3) editing an existing ingredient.
 */
export const createIngredientListPatch = (
  orig: IngredientListJSON,
  curr: IngredientListJSON
): rfc6902.Patch => {
  const patch = []
  const origLines = _.filter(_.get(orig, 'lines', []), line => line.id > 0)
  const currLines = _.get(curr, 'lines', [])

  let offset = 0

  // Check for changes in the original lines
  _.each(origLines, (origLine, origIdx) => {
    const currLine = _.find(currLines, { id: origLine.id })

    // Check whether the original line has been removed
    if (!currLine) {
      patch.push({ op: 'remove', path: `/lines/${origIdx + offset}` })
      offset -= 1
      return
    }

    // Check whether the original line has been changed
    if (!isSameIngredient(origLine, currLine)) {
      patch.push({
        op: 'replace',
        path: `/lines/${origIdx + offset}`,
        value: currLine
      })
    }
  })

  // Check the current lines to see if any are newly added
  _.each(currLines, (currLine, currIdx) => {
    if (currLine.id <= 0) {
      patch.push({
        op: 'add',
        path: `/lines/${currIdx + offset}`,
        value: currLine
      })
      offset += 1
    }
  })
  return patch
}

const ingredientLineProps = [
  'name',
  'optional',
  'preparation',
  'quantity_numerator',
  'quantity_denominator',
  'unit'
]

const isSameIngredient = (
  a: IngredientLineJSON,
  b: IngredientLineJSON
): boolean =>
  _.reduce(
    ingredientLineProps,
    (result, prop) => result && _.get(a, prop) === _.get(b, prop),
    true
  )
