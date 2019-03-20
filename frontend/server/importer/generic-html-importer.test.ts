import { GenericHTMLImporter as importer } from './generic-html-importer'
import { readFileSync } from 'fs'

describe('Generic HTML import', () => {
  describe('www.wholelivinglauren.com', () => {
    let source: string

    beforeEach(() => {
      source = readFileSync(
        'test/assets/www.wholelivinglauren.com/creamy-vegan-pumpkin-soup.html',
        { encoding: 'utf8' }
      )
    })

    test('title', async () => {
      const { title } = await importer(source)
      expect(title).toEqual('Creamy Vegan Pumpkin Soup')
    })

    test('description', async () => {
      const { description } = await importer(source)
      expect(description).toEqual(
        `Boy oh boy do I have something tasty (and super easy) for you today. I've said it before and I'll say it again. Soup is my jam. It's one of my absolute favorite foods. And this time of year there is nothing better than a piping hot bowl of creamy, comforting soup. Add pumpkin to the mix and WHOA...c`
      )
    })

    test('image_url', async () => {
      const { image_url } = await importer(source)
      expect(image_url).toEqual(
        'http://static1.squarespace.com/static/530e90a4e4b0340ce5266903/530e97a4e4b0fe3537f031c0/5817fd93c534a52382cccd35/1534429575718/fullsizeoutput_47b.jpeg?format=1500w'
      )
    })

    test('yield', async () => {
      const { yield: yld } = await importer(source)
      expect(yld).toEqual('4-5')
    })

    test('duration', async () => {
      const { duration } = await importer(source)
      expect(duration).toBeUndefined()
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'olive oil',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'medium yellow onion',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'chopped',
              optional: false,
              unit: undefined
            },
            {
              name: 'cloves garlic',
              quantity_numerator: 3,
              quantity_denominator: 1,
              preparation: 'minced',
              optional: false,
              unit: undefined
            },
            {
              name: 'cans 100% pumpkin puree (not pumpkin pie mix)',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'low sodium vegetable stock',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'can lite coconut milk',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'maple syrup',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'ground ginger',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'cinnamon',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'ground nutmeg',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'sea salt',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'pinch of cayenne pepper (optional)',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: undefined
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Heat olive oil in a large pot over medium-high heat and add onion and garlic. Cook for about 3-5 minutes, until onions become translucent. '
            },
            {
              text:
                'Carefully stir in the pumpkin, vegetable stock, coconut milk, maple syrup, ginger, cinnamon, nutmeg, salt, and cayenne (if using). '
            },
            {
              text:
                'Bring to a boil, then turn the heat to low and simmer for about 20 minutes, until the soup has reduced and thickened slightly.'
            },
            {
              text:
                'Puree with an immersion blender or in a stand blender until very smooth. Garnish with pepitas, cashew cream, and hot sauce. '
            },
            { text: 'Enjoy!' }
          ]
        }
      ])
    })
  })
})
