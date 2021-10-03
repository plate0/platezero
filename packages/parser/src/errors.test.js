const { RecipeError } = require('./errors')

describe('RecipeError', () => {
  test('construct', () => {
    const err = new RecipeError('invalid recipe', { title: 'hi' })
    expect(err.message).toEqual('invalid recipe')
    expect(err.stack).toBeDefined()
    expect(err.recipe).toEqual({ title: 'hi' })
  })
})
