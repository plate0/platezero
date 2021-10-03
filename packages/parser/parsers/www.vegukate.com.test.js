const { parser } = require('../src/parser')
const RecipeParser = require('./www.vegukate.com')
const { testAsset } = require('../test')

describe('vegukate.com', () => {
  const importer = parser(RecipeParser)
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
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(13)
  })

  test('procedure_lists', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text: 'Preheat oven to 350° F and line a baking dish with parchment paper.',
          },
          {
            text: 'In a large bowl combine all dry ingredients: oat flour, baking soda, sea salt, pumpkin pie spice, cacao powder, coconut flour, and coconut sugar. Stir well to combine. Add in all wet ingredients: coconut oil, pumpkin puree, maple syrup, almond milk, and vanilla extract. Stir well to incorporate all ingredients together. Brownie batter will be thick, cakey, and a bit spongy – this is good!',
          },
          {
            text: 'Evenly spread brownie batter into lined baking tray. Bake for 35-45 minutes, or until a toothpick or knife inserted into the center of the brownies comes out clean. Remove brownies from oven and let sit for 45-60 minutes to cool completely before cutting. Or dig in after 30 minutes and enjoy warm, gooey brownies.',
          },
          {
            text: 'Store cut brownies in an airtight container in the refrigerator for 4-5 days. These brownies are absolutely dreamy with coconut cream, cashew cream, coconut ice cream, or even pumpkin ice cream. Yum!',
          },
        ],
      },
    ])
  })
})
