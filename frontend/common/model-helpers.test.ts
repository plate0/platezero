import { normalize } from './model-helpers'

describe('normalize', () => {
  test('remove empty strings', () => {
    const res = normalize({ test: '', again: 'ok' })
    expect(res).toEqual({ again: 'ok' })
  })

  test('keep zeroes', () => {
    const res = normalize({ a: 0 })
    expect(res).toEqual({ a: 0 })
  })
})
