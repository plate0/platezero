import { CookingLight } from './cooking-light'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('www.cookinglight.com', () => {
  const importer = dom(CookingLight)

  let result
  beforeEach(async () => {
    const source = await testAsset(
      'www.cookinglight.com/beef-broccoli-stuffed-sweet-potatoes.html'
    )
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Beef and Broccoli Stuffed Sweet Potatoes - Cooking Light'
    )
  })

  test('description', () => {
    expect(result.description).toEqual(
      "Russets aren't the only spuds worth stuffing. Smoke and heat, achieved with chili powder and ground red pepper, work particularly well with sweet potatoes. This makes for a great paleo main dish, or cut them smaller and serve open-faced as a Super Bowl-style appetizer."
    )
  })

  test('duration', () => {
    expect(result.duration).toEqual(1500)
  })

  test('yield', () => {
    expect(result.yield).toEqual('Serves 4 (serving size: 1 stuffed potato)')
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toEqual([
      {
        lines: [
          {
            name: '(8-oz.) sweet potatoes',
            quantity_numerator: 4,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'extra-virgin olive oil, divided',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'chopped red onion',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'drained and chopped bottled roasted red bell peppers',
            quantity_numerator: 3,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'garlic cloves, minced',
            quantity_numerator: 4,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'chili powder',
            quantity_numerator: 2,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'kosher salt, divided',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'ground cumin',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'ground red pepper',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'ounces 90% lean ground sirloin',
            quantity_numerator: 10,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'frozen steam-in-bag broccoli florets',
            quantity_numerator: 2,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'chopped green onions',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'c'
          }
        ]
      }
    ])
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text:
              'Rub sweet potatoes with 1 1/2 teaspoons oil; pierce several times with a fork. Microwave at HIGH 12 to 15 minutes or until potatoes are tender.'
          },
          {
            text:
              'Heat a large skillet over medium-high. Add remaining 1 1/2 teaspoons oil; swirl to coat. Add onion and red bell peppers; cook 5 minutes or until tender, stirring frequently. Add garlic, and cook 3 minutes, stirring frequently. Stir in chili powder, 1/4 tea­spoon salt, cumin, and ground red pepper. Add beef; cook 6 minutes or until browned, stirring to crumble.'
          },
          {
            text:
              'Heat broccoli according to package directions; stir into beef mixture. Partially split potatoes lengthwise; fluff the flesh with a fork. Top potatoes evenly with beef mixture, remaining 1/4 teaspoon salt, and green onions.'
          }
        ]
      }
    ])
  })
})
