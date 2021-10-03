const { parser } = require('../src/parser')
const target = require('./www.myrecipes.com')
const Default = require('../src/default')
const { testAsset } = require('../test')
const importer = parser(target)

describe('myrecipes.com', () => {
  let recipe

  beforeAll(async () => {
    const source = await testAsset(
      'www.myrecipes.com/RoastedRedPepperHummusVeggieWrapsRecipe.html'
    )
    recipe = await importer(source)
  })

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // WARNING: This test requires an internet connection and depends on the behaviour of a target web site.
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  test.skip('fetch recipe from https://www.myrecipes.com', async () => {
    const urlString =
      'https://www.myrecipes.com/recipe/roasted-red-pepper-hummus-veggie-wraps'
    const response = await target.fetch(urlString, {})
    expect(response.status).toBe(200)
    expect(response.data).toBeDefined()
  })

  test('title', async () => {
    expect(recipe.title).toBe('Roasted Red Pepper Hummus Veggie Wraps')
  })

  test('description', async () => {
    expect(recipe.description).toBe(
      'Lunch to go never looked so good. Try these portable veggie wraps with any flavor of hummus you like and whatever crisp veggies you have on hand.'
    )
  })

  test('image_url', async () => {
    expect(recipe.image_url).toMatch(
      /roasted-red-pepper-hummus-veggie-wraps-ck.jpg/
    )
  })

  test('yield', async () => {
    expect(recipe.yield).toBe('Serves 4 (serving size: 1 wrap)')
  })

  test('procedure_lists', async () => {
    expect(recipe.procedure_lists).toBeDefined()
    expect(recipe.procedure_lists.length).toBe(1)
    expect(recipe.procedure_lists[0].name).toBeUndefined()
    expect(recipe.procedure_lists[0].lines.length).toBe(2)
    expect(recipe.procedure_lists[0].lines[0].title).toBeUndefined()
    expect(recipe.procedure_lists[0].lines[0].imaage_url).toBeUndefined()
    expect(recipe.procedure_lists[0].lines[0].text).toMatch(
      /^Spread about 1\/3 cup hummus over each tortilla/
    )
  })

  test('ingredient_lists', async () => {
    expect(recipe.ingredient_lists).toBeDefined()
    expect(recipe.ingredient_lists.length).toBe(1)
    expect(recipe.ingredient_lists[0].name).toBeUndefined()
    expect(recipe.ingredient_lists[0].image_url).toBeUndefined()
    expect(recipe.ingredient_lists[0].lines.length).toBe(7)
    expect(recipe.ingredient_lists[0].lines[0].quantity_numerator).toBe(3)
    expect(recipe.ingredient_lists[0].lines[0].quantity_denominator).toBe(2)
    expect(recipe.ingredient_lists[0].lines[0].unit).toBe('c')
    expect(recipe.ingredient_lists[0].lines[0].name).toBe(
      'prepared roasted red pepper hummus'
    )
    expect(recipe.ingredient_lists[0].lines[0].optional).toBe(false)
  })
})
