const { parser } = require('../src/parser')
const RecipeParser = require('./www.deliciousmagazine.co.uk')
const { testAsset } = require('../test')

describe('www.deliciousmagazine.co.uk', () => {
  const importer = parser(RecipeParser)

  let result
  beforeAll(async () => {
    const source = await testAsset(
      'www.deliciousmagazine.co.uk/tofu-with-caramel-and-sichuan-pepper.html'
    )
    result = importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Tofu with caramel and sichuan pepper | delicious. magazine'
    )
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(26)
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text: 'Put the tofu block on a plate between 2 thick wads of kitchen paper. Press down firmly to squeeze out as much moisture as possible, then use more kitchen paper to pat the surface of the tofu block dry.',
          },
          {
            text: 'Heat a glug of oil in a non-stick frying pan and fry the tofu on both sides for 4-5 minutes in total until crisp and golden. Remove from the pan (reserve the pan) and set aside.',
          },
          {
            text: 'To make the caramel sauce, put the sugar and 3 tbsp cold water in the pan and heat gently until the sugar dissolves and turns into an amber caramel. Add the remaining caramel sauce ingredients and stir to combine.',
          },
          {
            text: 'Return the tofu to the pan and baste in caramel sauce. Slice thickly, then serve on a platter, drizzled with the remaining caramel sauce and topped with the toasted sesame seeds, crispy shallots and micro coriander.',
          },
        ],
      },
    ])
  })
})
