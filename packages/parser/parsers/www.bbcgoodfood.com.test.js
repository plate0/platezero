const { parser } = require('../src/parser')
const RecipeParser = require('./www.bbcgoodfood.com')
const { testAsset } = require('../test')

describe('www.bbcgoodfood.com', () => {
  const importer = parser(RecipeParser)

  let result
  beforeAll(async () => {
    try {
      const source = await testAsset(
        'www.bbcgoodfood.com/VegetarianChilli.html'
      )
      result = importer(source)
    } catch (e) {
      console.error(e)
    }
  })

  test('title', () => {
    expect(result.title).toBe('Vegetarian chilli')
  })

  test('duration', () => {
    expect(result.duration).toBe(1920)
  })

  test('yield', () => {
    expect(result.yield).toBe(' Serves 2 ')
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(4)
    expect(result.ingredient_lists[0].lines[1].name).toBe(
      'can kidney beans in chilli sauce'
    )
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toHaveLength(1)
    expect(result.procedure_lists[0].lines).toHaveLength(1)
  })
})
