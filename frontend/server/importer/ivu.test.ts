import { IVU } from './ivu'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('IVU', () => {
  let result
  const importer = dom(IVU)

    beforeAll(async () => {
      const source = await testAsset(
              'ivu.org/sauteed-peppers.html'
      )
      result = await importer(source)
    })

  test('get title', async () => {
    expect(result.title).toEqual('Sauteed Peppers')
  })

  test('get author', async () => {
    expect(result.source_author).toEqual('Karen Sonnessa')
  })

  test('get yield', async () => {
    expect(result.yield).toEqual('Serving Size: 1')
  })

  test('get ingredient lists', async () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toEqual([
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 3,
        quantity_denominator: 1,
        unit: 'tbsp',
        name: 'olive oil'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 1,
        quantity_denominator: 1,
        unit: undefined,
        name: 'small red onion -- or 1/2 Vidalia'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 3,
        quantity_denominator: 1,
        unit: undefined,
        name: 'bell peppers -- (any color or colors'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 2,
        quantity_denominator: 1,
        unit: undefined,
        name: 'garlic cloves -- sliced (or powder)'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 1,
        quantity_denominator: 4,
        unit: 'c',
        name: 'tomato sauce'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 1,
        quantity_denominator: 1,
        unit: 'tbsp',
        name: 'balsamic vinegar'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: 1,
        quantity_denominator: 1,
        unit: 'tbsp',
        name: 'marjoram -- (1 t dried)'
      },
      {
        preparation: undefined,
        optional: false,
        quantity_numerator: undefined,
        quantity_denominator: undefined,
        unit: undefined,
        name: 'salt and pepper -- to taste'
      }
    ])
  })

  test('get procedure lists', async () => {
    expect(result.procedure_lists).toHaveLength(1)
    expect(result.procedure_lists[0].lines).toHaveLength(8)
    expect(result.procedure_lists[0].lines[0]['image_url']).toBeUndefined()
    expect(result.procedure_lists[0].lines[0]['title']).toBeUndefined()
    expect(result.procedure_lists[0].lines[0]['text']).toMatch(
      /^Quarter onion and slice thinly./
    )
  })
})
