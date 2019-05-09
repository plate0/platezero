import { Reddit } from './reddit'
import { testAsset } from '../../test/readfile'

describe('reddit', () => {
  const importer = Reddit

  let result
  beforeAll(async () => {
    const source = JSON.parse(
      await testAsset(
        'www.reddit.com/r/recipes/pasta_with_chicken_in_cream_sauce.json'
      )
    )
    result = await importer(source)
  })

  test('get title', () => {
    expect(result.title).toEqual('Pasta with chicken in cream sauce')
  })
})
