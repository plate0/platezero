import { Vegukate } from './vegukate'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('vegukate.com', () => {
  const importer = dom(Vegukate)
  let result
  beforeAll(async () => {
    const source = await testAsset(
      'vegukate.com/pumpkin-chocolate-dream-brownies.html'
    )
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Pumpkin & Chocolate Dream Brownies | VeguKate'
    )
  })

  test('yield', () => {
    expect(result.yield).toEqual('Makes 1 large tray of brownies')
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toEqual([
      {
        lines: [
          {
            name: 'rolled oats, ground into a flour (or use oat flour)',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'baking soda',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'sea salt',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'pumpkin pie spice',
            quantity_numerator: 2,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'freshly ground nutmeg',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'cacao powder',
            quantity_numerator: 4,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'coconut flour',
            quantity_numerator: 3,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'coconut sugar',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'coconut oil, melted',
            quantity_numerator: 3,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'pumpkin puree',
            quantity_numerator: 3,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'maple syrup',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'unsweetened almond milk',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'c'
          },
          {
            name: 'vanilla extract',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          }
        ]
      }
    ])
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          'Preheat oven to 350° F and line a baking dish with parchment paper.',
          'In a large bowl combine all dry ingredients: oat flour, baking soda, sea salt, pumpkin pie spice, cacao powder, coconut flour, and coconut sugar. Stir well to combine. Add in all wet ingredients: coconut oil, pumpkin puree, maple syrup, almond milk, and vanilla extract. Stir well to incorporate all ingredients together. Brownie batter will be thick, cakey, and a bit spongy – this is good!',
          'Evenly spread brownie batter into lined baking tray. Bake for 35-45 minutes, or until a toothpick or knife inserted into the center of the brownies comes out clean. Remove brownies from oven and let sit for 45-60 minutes to cool completely before cutting. Or dig in after 30 minutes and enjoy warm, gooey brownies.',
          'Store cut brownies in an airtight container in the refrigerator for 4-5 days. These brownies are absolutely dreamy with coconut cream, cashew cream, coconut ice cream, or even pumpkin ice cream. Yum!'
        ]
      }
    ])
  })
})
