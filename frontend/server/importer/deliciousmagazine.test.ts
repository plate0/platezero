import { DeliciousMagazine } from './deliciousmagazine'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('deliciousmagazine', () => {
  const importer = dom(DeliciousMagazine)

  let result
  beforeAll(async () => {
    const source = await testAsset(
      'www.deliciousmagazine.co.uk/tofu-with-caramel-and-sichuan-pepper.html'
    )
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Tofu with caramel and sichuan pepper | delicious. magazine'
    )
  })

  test('ingredient_lists', () => {
    expect(result.ingredient_lists).toEqual([
      {
        lines: [
          {
            name: 'block firm tofu (we used Cauldron, from large supermakets)',
            quantity_numerator: 396,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'g'
          },
          {
            name: 'Olive oil for frying',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'sesame seeds, toasted briefly in a dry pan until fragrant',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name:
              'Crispy fried shallots (from a tub) and micro coriander to serve',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'soft brown sugar',
            quantity_numerator: 125,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'g'
          },
          {
            name: 'red wine vinegar',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'Chinese black rice vinegar',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'light soy sauce',
            quantity_numerator: 25,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'ml'
          },
          {
            name: 'chilli bean paste',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'grated fresh ginger',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'garlic clove, crushed',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'sichuan pepper',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'bird’s eye chilli, finely sliced',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'block firm tofu (we used Cauldron, from large supermakets)',
            quantity_numerator: 396,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'g'
          },
          {
            name: 'Olive oil for frying',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'sesame seeds, toasted briefly in a dry pan until fragrant',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name:
              'Crispy fried shallots (from a tub) and micro coriander to serve',
            quantity_numerator: undefined,
            quantity_denominator: undefined,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'soft brown sugar',
            quantity_numerator: 125,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'g'
          },
          {
            name: 'red wine vinegar',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'Chinese black rice vinegar',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'light soy sauce',
            quantity_numerator: 25,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'ml'
          },
          {
            name: 'chilli bean paste',
            quantity_numerator: 1,
            quantity_denominator: 2,
            preparation: undefined,
            optional: false,
            unit: 'tbsp'
          },
          {
            name: 'grated fresh ginger',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'garlic clove, crushed',
            quantity_numerator: 1,
            quantity_denominator: 1,
            preparation: undefined,
            optional: false,
            unit: undefined
          },
          {
            name: 'sichuan pepper',
            quantity_numerator: 1,
            quantity_denominator: 4,
            preparation: undefined,
            optional: false,
            unit: 'tsp'
          },
          {
            name: 'bird’s eye chilli, finely sliced',
            quantity_numerator: 1,
            quantity_denominator: 2,
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
          {
            text:
              'Put the tofu block on a plate between 2 thick wads of kitchen paper. Press down firmly to squeeze out as much moisture as possible, then use more kitchen paper to pat the surface of the tofu block dry.'
          },
          {
            text:
              'Heat a glug of oil in a non-stick frying pan and fry the tofu on both sides for 4-5 minutes in total until crisp and golden. Remove from the pan (reserve the pan) and set aside.'
          },
          {
            text:
              'To make the caramel sauce, put the sugar and 3 tbsp cold water in the pan and heat gently until the sugar dissolves and turns into an amber caramel. Add the remaining caramel sauce ingredients and stir to combine.'
          },
          {
            text:
              'Return the tofu to the pan and baste in caramel sauce. Slice thickly, then serve on a platter, drizzled with the remaining caramel sauce and topped with the toasted sesame seeds, crispy shallots and micro coriander.'
          }
        ]
      }
    ])
  })
})
