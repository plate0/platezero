const { parser } = require('../src/parser')
const RecipeParser = require('./www.bonappetit.com')
const { testAsset } = require('../test')

describe('www.bonappetit.com', () => {
  const importer = parser(RecipeParser)
  let result
  beforeAll(async () => {
    const source = await testAsset('www.bonappetit.com/carrots.html')
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual('Harissa-and-Maple-Roasted Carrots')
  })

  test('description', () => {
    expect(result.description).toEqual(
      'A colorful and spicy (but not fiery!) side breaks up all the heavy, rich dishes on the table.'
    )
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(8)
    expect(result.ingredient_lists[0].lines[1]).toEqual({
      quantity_numerator: 1,
      quantity_denominator: 4,
      unit: 'c',
      name: 'olive oil',
      optional: false,
      preparation: undefined,
    })
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text: 'Preheat oven to 450°. Whisk garlic, oil, maple syrup, harissa, and cumin seeds in a small bowl; season garlic mixture with salt and pepper.',
          },
          {
            text: 'Toss carrots and lemon with garlic mixture in a large roasting pan to coat; season with salt and pepper. Roast, tossing occasionally, until carrots are tender and lemons are caramelized, 35–40 minutes.',
          },
          {
            text: '**DO AHEAD:** Carrots can be roasted 6 hours ahead. Let cool; cover and chill. Bring to room temperature or reheat slightly before serving.',
          },
        ],
      },
    ])
  })
})
