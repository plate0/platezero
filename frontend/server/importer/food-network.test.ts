import { FoodNetwork } from './food-network'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('Food Network importer', () => {
  let result
  beforeAll(async () => {
    const source = await testAsset(
      'www.foodnetwork.com/roasted-cauliflower-and-chickpeas-recipe-2107641.html'
    )
    const importer = dom(FoodNetwork)
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual('Roasted Cauliflower and Chickpeas')
  })

  test('description', () => {
    expect(result.description).toEqual(
      'Get Roasted Cauliflower and Chickpeas Recipe from Food Network'
    )
  })

  test('image_url', () => {
    expect(result.image_url).toEqual(
      'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/3/3/0/GI1110H_Roasted-Cauliflower-and-Chickpeas_s4x3.jpg.rend.hgtvcom.616.462.suffix/1371606179656.jpeg'
    )
  })

  test('yield', () => {
    expect(result.yield).toEqual('4 servings')
  })

  test('duration', () => {
    expect(result.duration).toEqual(3300)
  })

  test('preheats', () => {
    expect(result.preheats).toEqual([
      {
        name: 'oven',
        temperature: 400,
        unit: 'F'
      }
    ])
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toEqual([
      {
        lines: [
          {
            name: 'ground coriander',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'ground turmeric',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'cumin seeds',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'fennel seeds',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'cayenne pepper',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'vegetable oil',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'grated fresh ginger',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'head cauliflower, cut into florets',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'One 19-ounce can chickpeas, drained',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'sweet onion, sliced',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'Kosher salt and freshly cracked black pepper',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'Kosher salt and freshly cracked black pepper',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'Fresh cilantro sprigs, for garnish',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'Juice of 1/2 lime',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          }
        ]
      }
    ])
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          { text: 'Preheat the oven to 400 degrees F.' },
          {
            text:
              'Toast the coriander, turmeric, cumin seeds, fennel seeds and cayenne in a dry skillet over high heat until fragrant, 2 to 3 minutes. Pour the oil into a large mixing bowl, and then add the toasted spices. Add the ginger, cauliflower, chickpeas and onions, and toss to coat everything evenly. Place on a sheet tray and season with salt and pepper. Roast in the oven until browned and the cauliflower is tender, 30 to 35 minutes. Serve with cilantro sprigs and finish with a squeeze of the fresh lime juice.'
          }
        ]
      }
    ])
  })
})
