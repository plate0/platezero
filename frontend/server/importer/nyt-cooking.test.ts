import { NYTCookingImporter as importer } from './nyt-cooking'
import { readFileSync } from 'fs'

const recipe =
  'test/assets/cooking.nytimes.com/1014688-baked-orzo-with-artichokes-and-peas.html'

describe('NYT Cooking import', () => {
  let source: string

  beforeEach(() => {
    source = readFileSync(recipe, { encoding: 'utf8' })
  })

  test('get title', async () => {
    const { title } = await importer(source)
    expect(title).toEqual('Baked Orzo With Artichokes and Peas')
  })

  test('get subtitle', async () => {
    const { subtitle } = await importer(source)
    expect(subtitle).toBeUndefined()
  })

  test('get description', async () => {
    const { description } = await importer(source)
    expect(description).toEqual(
      'This is a Greek-inspired pastitsio, a comforting béchamel-enriched mix of orzo, artichokes and peas. Rather than butter, the béchamel in this dish is made with a couple of glugs of good extra virgin olive oil.'
    )
  })

  test('get image_url', async () => {
    const { image_url } = await importer(source)
    expect(image_url).toEqual(
      'https://static01.nyt.com/images/2013/04/23/science/23recipehealth/23recipehealth-articleLarge.jpg'
    )
  })

  test('get yield', async () => {
    const { yield: yld } = await importer(source)
    expect(yld).toEqual('6 servings')
  })

  test('get duration', async () => {
    const { duration } = await importer(source)
    expect(duration).toEqual(4200)
  })

  test('get preheats', async () => {
    const { preheats } = await importer(source)
    expect(preheats).toEqual([
      {
        name: 'the oven',
        temperature: 350,
        unit: 'F'
      }
    ])
  })

  test('get ingredients', async () => {
    const { ingredient_lists } = await importer(source)
    expect(ingredient_lists).toEqual([
      {
        lines: [
          {
            name: 'recipe olive oil béchamel',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 1,
            unit: undefined
          },
          {
            name: 'Juice of 1 lemon',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 1,
            unit: undefined
          },
          {
            name: 'small globe artichokes or 2 large globe artichokes',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 4,
            unit: undefined
          },
          {
            name: 'extra virgin olive oil',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 2,
            unit: 'tbsp'
          },
          {
            name: 'large garlic cloves',
            optional: false,
            preparation: 'minced, or 1 small bulb of green garlic, minced',
            quantity_denominator: 1,
            quantity_numerator: 2,
            unit: undefined
          },
          {
            name: 'orzo (about 1 2/3 cups)',
            optional: false,
            preparation: undefined,
            quantity_denominator: 4,
            quantity_numerator: 3,
            unit: 'lb'
          },
          {
            name: 'shelled fresh peas (about 1 pound in the shells)',
            optional: false,
            preparation: undefined,
            quantity_denominator: 4,
            quantity_numerator: 3,
            unit: 'c'
          },
          {
            name: 'finely chopped parsley',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 2,
            unit: 'tbsp'
          },
          {
            name: 'finely chopped dill',
            optional: false,
            preparation: undefined,
            quantity_denominator: 1,
            quantity_numerator: 2,
            unit: 'tbsp'
          },
          {
            name: 'ounces Parmesan',
            optional: false,
            preparation: 'grated (1/2 cup)',
            quantity_denominator: 1,
            quantity_numerator: 2,
            unit: undefined
          }
        ],
        name: 'Ingredients'
      }
    ])
  })

  test('get procedure', async () => {
    const { procedure_lists } = await importer(source)
    expect(procedure_lists).toEqual([
      {
        lines: [
          { text: 'Make the béchamel and set aside.' },
          {
            text:
              'Prepare the artichokes. Fill a bowl with water and add the lemon juice. Cut away the stem and the top third of each artichoke, break off the leaves and trim them down to the bottoms, placing them in the water as you go along. Quarter them and slice large quarters about 1/4 inch thick. Save the leaves and steam them; serve them as a first course or a side dish.'
          },
          {
            text:
              'Drain the artichoke hearts and dry on a clean dish towel. Heat the oil over medium-high heat in a large, heavy skillet. Add the sliced artichoke hearts and cook, stirring, until lightly browned and tender, about 10 minutes. Season to taste with salt and pepper. Turn down the heat and add the garlic. Cook just until fragrant, about 30 seconds, and remove from the heat.'
          },
          {
            text:
              'Preheat the oven to 350 degrees. Oil a 2-quart baking dish. Bring a large pot of generously salted water to a boil and add the orzo. Cook 5 minutes, add the peas and continue to boil for another 4 minutes, until the orzo is just tender but still firm to the bite. Drain and transfer to a large bowl. Add the artichokes, herbs, béchamel and Parmesan and stir together until the sauce coats all of the other ingredients. Transfer to the prepared baking dish.'
          },
          {
            text:
              'Place in the oven and bake 30 minutes, until lightly colored on top.'
          }
        ]
      }
    ])
  })
})
