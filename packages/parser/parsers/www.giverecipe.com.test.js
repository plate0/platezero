const { parser } = require('../src/parser')
const RecipeParser = require('./www.giverecipe.com')
const { testAsset } = require('../test')

describe('www.giverecipe.com', () => {
  const importer = parser(RecipeParser)
  let result
  beforeAll(async () => {
    const source = await testAsset('www.giverecipe.com/hummus.html')
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual('Homemade Hummus Without Tahini')
  })

  test('description', () => {
    expect(result.description).toEqual(
      'Homemade creamy hummus made without tahini. Ready in 5 minutes.'
    )
  })

  test('yield', () => {
    expect(result.yield).toEqual('4')
  })

  test('duration', () => {
    expect(result.duration).toEqual(300)
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(2)
    expect(result.ingredient_lists[0].name).toEqual('Hummus:')
    expect(result.ingredient_lists[0].lines).toHaveLength(7)
    expect(result.ingredient_lists[0].lines[0].name).toEqual(
      'can (15 oz) chickpeas, rinsed and drained'
    )
    expect(result.ingredient_lists[1].name).toEqual('Optional garnish:')
    expect(result.ingredient_lists[1].lines).toHaveLength(6)
    expect(result.ingredient_lists[1].lines[0].name).toEqual(
      'pumpkin seed oil or extra virgin olive oil'
    )
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text: 'Put all ingredients for hummus in a food processor. Process until smooth. Add in extra water if it’s too thick. Taste and add extra lemon juice or salt if needed.',
          },
          {
            text: 'Transfer into a bowl, make a swirl and drizzle pumpkin seed oil over it. Garnish with tomatoes, green olives, chickpeas, sunflower seeds and mint springs.',
          },
          { text: 'Serve with crackers, vegetables, chips or pita.' },
        ],
      },
    ])
  })
})
