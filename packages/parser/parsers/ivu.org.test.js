const { parser } = require('../src/parser')
const RecipeParser = require('./ivu.org')
const { testAsset } = require('../test')

describe('IVU', () => {
  let result
  const importer = parser(RecipeParser)

  beforeAll(async () => {
    const source = await testAsset('ivu.org/sauteed-peppers.html')
    result = await importer(source)
  })

  test('title', async () => {
    expect(result.title).toEqual('Sauteed Peppers')
  })

  test('author', async () => {
    expect(result.source_author).toEqual('Karen Sonnessa')
  })

  test('yield', async () => {
    expect(result.yield).toEqual('Serving Size: 1')
  })

  test('ingredient lists', async () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(8)
  })

  test('get procedure lists', async () => {
    expect(result.procedure_lists).toHaveLength(1)
    expect(result.procedure_lists[0].lines).toHaveLength(8)
    expect(result.procedure_lists[0].lines[0]['image_url']).toBeUndefined()
    expect(result.procedure_lists[0].lines[0]['title']).toBeUndefined()
    expect(result.procedure_lists[0].lines[0]['text']).toMatch(
      /^Quarter onion and slice thinly./
    )
  })
})
