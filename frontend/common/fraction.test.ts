import { fraction } from './fraction'

describe('Fraction', () => {
  test('½', () => {
    const f = fraction('½')
    expect(f.n).toEqual(1)
    expect(f.d).toEqual(2)
  })
  test('1½', () => {
    const f = fraction('1½')
    expect(f.n).toEqual(3)
    expect(f.d).toEqual(2)
  })
})
