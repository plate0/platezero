import { validate } from './validator'

describe('validator', () => {
  const ingredientLine = { name: 'stuff', optional: false }
  const procedureLine = { text: 'do it' }

  test('happy path', () => {
    const recipe = {
      title: 'My Recipe',
      ingredient_lists: [{ lines: [ingredientLine] }],
      procedure_lists: [{ lines: [procedureLine] }]
    }
    expect(validate(recipe)).toEqual([])
  })

  test('no ingredients', () => {
    const recipe = {
      title: 'My Recipe',
      ingredient_lists: [],
      procedure_lists: [{ lines: [procedureLine] }]
    }
    expect(validate(recipe)).toEqual(['No ingredients found'])
  })

  test('no procedures', () => {
    const recipe = {
      title: 'My Recipe',
      ingredient_lists: [{ lines: [ingredientLine] }],
      procedure_lists: []
    }
    expect(validate(recipe)).toEqual(['No procedures found'])
  })
})
