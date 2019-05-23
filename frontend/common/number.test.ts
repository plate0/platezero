import { maybeNumber } from './number'

describe('maybeNumber', () => {
  test('zero string', () => {
    expect(maybeNumber('0')).toEqual(0)
  })

  test('positive string', () => {
    expect(maybeNumber('50')).toEqual(50)
  })

  test('negative string', () => {
    expect(maybeNumber('-50')).toEqual(-50)
  })

  test('negative number', () => {
    expect(maybeNumber(-50)).toEqual(-50)
  })

  test('positive number', () => {
    expect(maybeNumber(50)).toEqual(50)
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

  test('nan', () => {
    expect(maybeNumber(NaN)).toBeUndefined()
  })

  test('infinity', () => {
    expect(maybeNumber(Infinity)).toBeUndefined()
  })
})
