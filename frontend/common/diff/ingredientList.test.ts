import * as _ from 'lodash'

import { createIngredientListPatch } from './ingredientList'
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
    expect(createIngredientListPatch(a, b)).toBePatchFor(a, b)
  })

  test('remove an item', () => {
    const [a, b] = [list([onions]), list([])]
    expect(createIngredientListPatch(a, b)).toBePatchFor(a, b)
  })

  test('remove middle item', () => {
    const [a, b] = [list([onions, carrots, celery]), list([onions, celery])]
    expect(createIngredientListPatch(a, b)).toBePatchFor(a, b)
  })

  test('add middle item', () => {
    const [a, b] = [list([onions, carrots]), list([onions, beets, celery])]
    expect(createIngredientListPatch(a, b)).toBePatchFor(a, b)
  })

  test('replace middle item', () => {
    const [a, b] = [
      list([onions, carrots, celery]),
      list([onions, beets, celery])
    ]
    expect(createIngredientListPatch(a, b)).toBePatchFor(a, b)
  })
})
