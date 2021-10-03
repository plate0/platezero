const { parser } = require('../src/parser')
const RecipeParser = require('./www.allrecipes.com')
const { testAsset } = require('../test')

describe('www.allrecipes.com', () => {
  const importer = parser(RecipeParser)

  let result
  beforeAll(async () => {
    const source = await testAsset(
      'www.allrecipes.com/garlic-roasted-chicken-and-potatoes.html'
    )
    result = importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual('Garlic Roasted Chicken and Potatoes Recipe')
  })

  test('duration', () => {
    expect(result.duration).toEqual(4800)
  })

  test('yield', () => {
    expect(result.yield).toEqual('8')
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(6)
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toHaveLength(1)
    expect(result.procedure_lists[0].lines).toHaveLength(4)
  })
})
