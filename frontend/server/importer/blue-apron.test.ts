import { BlueApron } from './blue-apron'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('Blue Apron', () => {
  const importer = dom(BlueApron)

  describe('mexican chicken zucchini rice', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'blueapron/mexican-spiced-chicken-zucchini-rice-with-tomato-jalapeno-salsa.html'
      )
      result = await importer(source)
    })

    test('get title', () => {
      expect(result.title).toEqual('Mexican-Spiced Chicken & Zucchini Rice')
    })

    test('get subtitle', () => {
      expect(result.subtitle).toEqual('with Tomato & Jalapeño Salsa')
    })

    test('get description', () => {
      expect(result.description).toEqual(
        'To top our seared, spiced chicken, we’re making a vibrant salsa with juicy tomatoes, spicy pickled jalapeño, and scallions—contrasted by a finishing dollop of creamy fromage blanc. A simple combo of jasmine rice and sautéed zucchini makes for the perfect base to balance out the bold flavors.'
      )
    })

    test('get yield', () => {
      expect(result.yield).toEqual('2 servings')
    })

    test('get ingredient lists', () => {
      expect(result.ingredient_lists).toHaveLength(1)
      expect(result.ingredient_lists[0].lines).toEqual([
        {
          name: 'Boneless, Skinless Chicken Breasts',
          quantity_numerator: 2,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: undefined
        },
        {
          name: 'Jasmine Rice',
          quantity_numerator: 1,
          quantity_denominator: 2,
          preparation: undefined,
          optional: false,
          unit: 'c'
        },
        {
          name: 'Grape Or Cherry Tomatoes',
          quantity_numerator: 4,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: 'oz'
        },
        {
          name: 'Scallions',
          quantity_numerator: 2,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: undefined
        },
        {
          name: 'Zucchini',
          quantity_numerator: 1,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: undefined
        },
        {
          name: 'Rice Vinegar',
          quantity_numerator: 1,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: 'tbsp'
        },
        {
          name: 'Sliced Pickled Jalapeño Pepper',
          quantity_numerator: 1,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: 'oz'
        },
        {
          name: 'Fromage Blanc',
          quantity_numerator: 2,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: 'tbsp'
        },
        {
          name:
            'Mexican Spice Blend (Ancho Chile Powder, Smoked Paprika, Garlic Powder, Ground Cumin & Dried Mexican Oregano)',
          quantity_numerator: 1,
          quantity_denominator: 1,
          preparation: undefined,
          optional: false,
          unit: 'tbsp'
        }
      ])
    })

    test('get procedure lists', () => {
      expect(result.procedure_lists).toHaveLength(1)
      expect(result.procedure_lists[0].lines).toHaveLength(5)
      expect(result.procedure_lists[0].lines[0]).toEqual({
        image_url:
          'https://media.blueapron.com/recipes/21409/recipe_steps/32374/1548270543-426-0028-6520/Jasmine_2P_Stockpot-Medium_Fluff_WEB_high_feature.jpg',
        title: 'Cook the rice:',
        text:
          'In a medium pot, combine the **rice**,** a pinch of salt**, and **1 cup of water**. Heat to boiling on high. Once boiling, reduce the heat to low. Cover and cook, without stirring, 12 to 14 minutes, or until the water has been absorbed and the rice is tender. Turn off the heat and fluff with a fork. Cover to keep warm.'
      })
    })
  })

  describe('smoked gouda burgers', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'blueapron/smoked-gouda-burgers-with-caramelized-onion-carrot-fries.html'
      )
      result = await importer(source)
    })

    test('get preheats', async () => {
      expect(result.preheats).toHaveLength(1)
      expect(result.preheats).toEqual([
        { name: 'oven', temperature: 450, unit: 'F' }
      ])
    })
  })

  describe('stuffed zucchini', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'blueapron/stuffed-zucchini-with-carrots-currants-freekeh.html'
      )
      result = await importer(source)
    })

    test('get title', () => {
      expect(result.title).toEqual('Stuffed Zucchini')
    })
  })
})
