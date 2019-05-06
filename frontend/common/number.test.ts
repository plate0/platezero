import { maybeNumber } from './number'

describe('maybeNumber', () => {
  test('zero', () => {
    expect(maybeNumber('0')).toEqual(0)
  })

  test('positive', () => {
    expect(maybeNumber('50')).toEqual(50)
  })

  test('negative', () => {
    expect(maybeNumber('-50')).toEqual(-50)
  })

  test('empty string', () => {
    expect(maybeNumber('')).toBeUndefined()
  })

  test('undefined', () => {
    expect(maybeNumber(undefined)).toBeUndefined()
  })

  test('null', () => {
    expect(maybeNumber(null)).toBeUndefined()
  })
})
