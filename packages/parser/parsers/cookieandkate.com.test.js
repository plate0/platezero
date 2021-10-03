const util = require('util')
const { parser } = require('../src/parser')
const RecipeParser = require('./cookieandkate.com')
const importer = parser(RecipeParser)
const { testAsset } = require('../test')

describe('cookieandkate', () => {
  let result

  beforeAll(async () => {
    const source = await testAsset(
      'cookieandkate.com/ExtraVegetableFriedRice.html'
    )
    result = await importer(source)
    //    debug(util.inspect(result, {depth: 4}))
  })

  test('title', async () => {
    expect(result.title).toBe('Extra Vegetable Fried Rice')
  })

  test('description', async () => {
    expect(result.description).toMatch(
      /^Learn how to make vegetable fried rice/
    )
  })

  test('source_author', async () => {
    expect(result.source_author).toBe('Cookie and Kate')
  })

  test('image_url', async () => {
    expect(result.image_url).toBe(
      'https://cookieandkate.com/images/2017/05/vegetable-fried-rice.jpg'
    )
  })

  test('duration', async () => {
    expect(result.duration).toEqual(2100)
  })

  test('yield', async () => {
    expect(result.yield).toEqual('2')
  })

  test('ingredient lists', async () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].name).toBeUndefined()
    expect(result.ingredient_lists[0].lines).toHaveLength(15)
    expect(result.ingredient_lists[0].lines[0]).toMatchObject({
      name: '+ 2 tablespoons avocado oil or safflower oil, divided',
      quantity_numerator: 3,
      quantity_denominator: 2,
      unit: 'tsp',
    })
  })

  test('procedure lists', async () => {
    expect(result.procedure_lists).toHaveLength(1)
    expect(result.procedure_lists[0].name).toBeUndefined()
    expect(result.procedure_lists[0].lines).toHaveLength(7)
    expect(result.procedure_lists[0].lines[0]).toMatchObject({
      //      name: expect.toBe(null), Doesn't work, see https://stackoverflow.com/questions/53369407/include-tobecloseto-in-jest-tomatchobject
      text: expect.stringMatching(/^This recipe comes together quickly/),
    })
  })
})

function debug(msg) {
  console.log(`\x1b[7m${msg}\x1b[0m`)
}
