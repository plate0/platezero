import * as _ from 'lodash'

import { IngredientListPatch } from './ingredientList'
import '../../test/matchers'
import { IngredientLineJSON } from '../../models'

const ingredientLine = (overrides?: object): IngredientLineJSON =>
  Object.assign(
    {},
    {
      id: 0,
      name: 'onion',
      quantity_numerator: 1,
      quantity_denominator: 3,
      preparation: 'diced',
      optional: false,
      unit: 'c'
    },
    overrides
  )

const [onions, carrots, celery, beets] = [
  ingredientLine({ id: 1, name: 'onions' }),
  ingredientLine({ id: 2, name: 'carrots' }),
  ingredientLine({ id: 3, name: 'celery' }),
  ingredientLine({ id: 0, name: 'beets' })
]

const list = (lines: IngredientLineJSON[]) => ({ lines })

describe('ingredient list patch', () => {
  test('add an item', () => {
    const [a, b] = [list([]), list([beets])]
    const p = new IngredientListPatch(a)
    p.addIngredient(beets)
    expect(p.getPatch()).toBePatchFor(a, b)
  })

  test('remove an item', () => {
    const [a, b] = [list([onions]), list([])]
    const p = new IngredientListPatch(a)
    p.removeIngredient(onions.id)
    expect(p.getPatch()).toBePatchFor(a, b)
  })

  test('remove middle item', () => {
    const [a, b] = [list([onions, carrots, celery]), list([onions, celery])]
    const p = new IngredientListPatch(a)
    p.removeIngredient(carrots.id)
    expect(p.getPatch()).toBePatchFor(a, b)
  })

  test('remove then add', () => {
    const [a, b] = [
      list([onions, carrots, celery]),
      list([{ ...celery, name: 'turnip' }, beets])
    ]
    const p = new IngredientListPatch(a)
    p.removeIngredient(carrots.id)
    p.removeIngredient(onions.id)
    p.addIngredient(beets)
    p.replaceIngredient(celery.id, { ...celery, name: 'turnip' })
    expect(p.getPatch()).toBePatchFor(a, b)
  })
})
