const { parser } = require('../src/parser')
const RecipeParser = require('./www.cookinglight.com')
const { testAsset } = require('../test')

describe('www.cookinglight.com', () => {
  const importer = parser(RecipeParser)

  let result
  beforeEach(async () => {
    const source = await testAsset(
      'www.cookinglight.com/beef-broccoli-stuffed-sweet-potatoes.html'
    )
    result = importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Beef and Broccoli Stuffed Sweet Potatoes - Cooking Light'
    )
  })

  test('duration', () => {
    expect(result.duration).toEqual(1500)
  })

  test('yield', () => {
    expect(result.yield).toEqual('Serves 4 (serving size: 1 stuffed potato)')
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(12)
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text: 'Rub sweet potatoes with 1 1/2 teaspoons oil; pierce several times with a fork. Microwave at HIGH 12 to 15 minutes or until potatoes are tender.',
          },
          {
            text: 'Heat a large skillet over medium-high. Add remaining 1 1/2 teaspoons oil; swirl to coat. Add onion and red bell peppers; cook 5 minutes or until tender, stirring frequently. Add garlic, and cook 3 minutes, stirring frequently. Stir in chili powder, 1/4 tea­spoon salt, cumin, and ground red pepper. Add beef; cook 6 minutes or until browned, stirring to crumble.',
          },
          {
            text: 'Heat broccoli according to package directions; stir into beef mixture. Partially split potatoes lengthwise; fluff the flesh with a fork. Top potatoes evenly with beef mixture, remaining 1/4 teaspoon salt, and green onions.',
          },
        ],
      },
    ])
  })
})
