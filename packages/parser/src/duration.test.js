const { _parseDuration: parse } = require('./duration')

describe('duration', () => {
  test.each`
    d                      | expected
    ${'PT30M'}             | ${1800}
    ${'1 h 20 m'}          | ${4800}
    ${'1 hour 20 minutes'} | ${4800}
    ${'1 h'}               | ${3600}
    ${'1 hour'}            | ${3600}
  `('returns $expected seconds when "$d" is parsed', ({ d, expected }) => {
    expect(parse(d)).toBe(expected)
  })
})
