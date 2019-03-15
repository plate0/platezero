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
export class IngredientListPatch {
  private patch: rfc6902.Patch = []
  private currentModel: IngredientListJSON

  constructor(original: IngredientListJSON) {
    this.currentModel = _.cloneDeep(original)
  }

  public removeIngredient(id: number): void {
    const idx = _.findIndex(this.currentModel.lines, { id })
    if (idx < 0) {
      throw new Error(`ingredient ${id} was not found in list`)
    }
    this.patch.push({ op: 'remove', path: `/lines/${idx}` })
    this.currentModel.lines = _.reject(this.currentModel.lines, { id })
  }

  public addIngredient(value: IngredientLineJSON): void {
    this.patch.push({ op: 'add', path: '/lines/-', value })
    this.currentModel.lines = [...this.currentModel.lines, value]
  }

  public replaceIngredient(id: number, value: IngredientLineJSON): void {
    const idx = _.findIndex(this.currentModel.lines, { id })
    if (idx < 0) {
      throw new Error(`ingredient ${id} was not found in list`)
    }
    this.patch.push({ op: 'replace', path: `/lines/${idx}`, value })
    this.currentModel.lines[idx] = value
  }

  public getPatch(): rfc6902.Patch {
    return optimize([...this.patch])
  }
}

/**
 * Given an RFC6902 patch, optimize it into fewer operations if possible
 *
 * Right now, the only optimization that is implemented is condensing repeated
 * "replace" operations for the same path to only include the final one.
 */
const optimize = (patch: rfc6902.Patch): rfc6902.Patch => {
  const optimized = []
  for (let i = 0; i < patch.length; i++) {
    const p0 = patch[i]
    const p1 = patch[i + 1]
    if (operationOverwrites(p0, p1)) {
      continue
    }
    optimized.push(p0)
  }
  return optimized
}

const operationOverwrites = (
  p0: rfc6902.Operation,
  p1: rfc6902.Operation
): boolean =>
  p1 && p0.op === 'replace' && p1.op === 'replace' && p0.path === p1.path
