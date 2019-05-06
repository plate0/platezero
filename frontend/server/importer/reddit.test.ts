import { Reddit } from './reddit'
import { readFileSync } from 'fs'

describe('reddit', () => {
  let source: string
  let importer = Reddit

  beforeEach(() => {
    source = JSON.parse(
      readFileSync(
        'test/assets/www.reddit.com/r/recipes/pasta_with_chicken_in_cream_sauce.json',
        { encoding: 'utf8' }
      )
    )
  })

  test('get title', async () => {
    const { title } = await importer(source)
    expect(title).toEqual('Pasta with chicken in cream sauce')
  })
})
