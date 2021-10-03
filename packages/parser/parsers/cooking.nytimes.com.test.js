const { parser } = require('../src/parser')
const RecipeParser = require('./cooking.nytimes.com')
const { testAsset } = require('../test')

describe('cooking.nytimes.com', () => {
  const importer = parser(RecipeParser)
  describe('baked-orzo-with-artichokes-and-peas', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'cooking.nytimes.com/1014688-baked-orzo-with-artichokes-and-peas.html'
      )
      result = await importer(source)
    })

    test('title', () => {
      expect(result.title).toEqual('Baked Orzo With Artichokes and Peas Recipe')
    })

    test('description', () => {
      expect(result.description).toEqual(
        'This is a Greek-inspired pastitsio, a comforting béchamel-enriched mix of orzo, artichokes and peas. Rather than butter, the béchamel in this dish is made with a couple of glugs of good extra virgin olive oil.'
      )
    })

    test('subtitle', () => {
      expect(result.subtitle).toBeUndefined()
    })

    test('image_url', () => {
      expect(result.image_url).toEqual(
        'https://static01.nyt.com/images/2013/04/23/science/23recipehealth/23recipehealth-superJumbo.jpg'
      )
    })

    test('yield', () => {
      expect(result.yield).toEqual('6 servings')
    })

    test('duration', () => {
      expect(result.duration).toEqual(4200)
    })

    test('preheats', () => {
      expect(result.preheats).toEqual([
        {
          name: 'oven',
          temperature: 350,
          unit: 'F',
        },
      ])
    })

    test('get ingredients', () => {
      expect(result.ingredient_lists).toHaveLength(1)
      expect(result.ingredient_lists[0].lines).toHaveLength(10)
    })

    test('get procedure', () => {
      expect(result.procedure_lists).toEqual([
        {
          lines: [
            { text: 'Make the béchamel and set aside.' },
            {
              text: 'Prepare the artichokes. Fill a bowl with water and add the lemon juice. Cut away the stem and the top third of each artichoke, break off the leaves and trim them down to the bottoms, placing them in the water as you go along. Quarter them and slice large quarters about 1/4 inch thick. Save the leaves and steam them; serve them as a first course or a side dish.',
            },
            {
              text: 'Drain the artichoke hearts and dry on a clean dish towel. Heat the oil over medium-high heat in a large, heavy skillet. Add the sliced artichoke hearts and cook, stirring, until lightly browned and tender, about 10 minutes. Season to taste with salt and pepper. Turn down the heat and add the garlic. Cook just until fragrant, about 30 seconds, and remove from the heat.',
            },
            {
              text: 'Preheat the oven to 350 degrees. Oil a 2-quart baking dish. Bring a large pot of generously salted water to a boil and add the orzo. Cook 5 minutes, add the peas and continue to boil for another 4 minutes, until the orzo is just tender but still firm to the bite. Drain and transfer to a large bowl. Add the artichokes, herbs, béchamel and Parmesan and stir together until the sauce coats all of the other ingredients. Transfer to the prepared baking dish.',
            },
            {
              text: 'Place in the oven and bake 30 minutes, until lightly colored on top.',
            },
          ],
        },
      ])
    })
  })

  describe('one-pot-pasta-with-ricotta-and-lemon.html', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'cooking.nytimes.com/1020290-one-pot-pasta-with-ricotta-and-lemon.html'
      )
      result = await importer(source)
    })

    test('description', () => {
      expect(result.description).toEqual(
        'This elegant, bright pasta dish comes together in about the same amount of time it takes to boil noodles and heat up a jar of store-bought marinara. The no-cook sauce is a 50-50 mix of ricotta and Parmesan, with the zest and juice of one lemon thrown in. That’s it. To make it more filling, add peas, asparagus or spinach in the last few minutes of the pasta boiling, or stir in fresh arugula or watercress with the sauce in Step 3. It’s a weeknight and for-company keeper any way you stir it.'
      )
    })

    test('ingredients', () => {
      expect(result.ingredient_lists).toHaveLength(1)
      expect(result.ingredient_lists[0].lines).toHaveLength(8)
    })
  })
})
