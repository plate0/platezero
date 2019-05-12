import { Ivu } from './ivu'
import { dom } from './html'
import { readFileSync } from 'fs'

const recipe =
  'test/assets/ivu.org/sauteed-peppers.html'

describe('IVU', () => {
  let source: string
  let importer = dom(Ivu)

  beforeEach(() => {
    source = readFileSync(recipe, { encoding: 'utf8' })
  })

  test('get title', async () => {
    const { title } = await importer(source)
    expect(title).toEqual('Sauteed Peppers')
  })

  test('get author', async () => {
    const { source_author } = await importer(source)
    expect(source_author).toEqual('Karen Sonnessa')
  })

  test('get yield', async () => {
    const o = await importer(source)
    const Yield = o['yield']
    expect(Yield).toEqual('1')
  })

  test('get ingredient lists', async () => {
      const { ingredient_lists: list } = await importer(source)
      expect(list).toHaveLength(1)
      expect(list[0].lines).toEqual([
            {preparation: undefined, optional: false, quantity_numerator: 3,         quantity_denominator: 1,         unit: 'tbsp',      name: 'olive oil'},
            {preparation: undefined, optional: false, quantity_numerator: 1,         quantity_denominator: 1,         unit: undefined,   name: 'small red onion -- or 1/2 Vidalia'},
            {preparation: undefined, optional: false, quantity_numerator: 3,         quantity_denominator: 1,         unit: undefined,   name: 'bell peppers -- (any color or colors'},
            {preparation: undefined, optional: false, quantity_numerator: 2,         quantity_denominator: 1,         unit: undefined,   name: 'garlic cloves -- sliced (or powder)'},
            {preparation: undefined, optional: false, quantity_numerator: 1,         quantity_denominator: 4,         unit: 'c',         name: 'tomato sauce'},
            {preparation: undefined, optional: false, quantity_numerator: 1,         quantity_denominator: 1,         unit: 'tbsp',      name: 'balsamic vinegar'},
            {preparation: undefined, optional: false, quantity_numerator: 1,         quantity_denominator: 1,         unit: 'tbsp',      name: 'marjoram -- (1 t dried)'},
            {preparation: undefined, optional: false, quantity_numerator: undefined, quantity_denominator: undefined, unit: undefined,   name: 'salt and pepper -- to taste'}
            ])
      })
})