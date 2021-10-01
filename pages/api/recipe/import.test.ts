import { toSlug } from './import'

describe('slugification', () => {
  it('should map unicode to an ascii aproximation', () => {
    expect(toSlug('façile')).toBe('facile')
  })

  it('should translate characters to a meaningful equivalent', () => {
    expect(toSlug('it was $5')).toBe('it-was-dollar5')
  })

  it('should replace non-alphanumeric characters', () => {
    expect(toSlug('asdf!asdf')).toBe('asdf-asdf')
    expect(toSlug('asdf*asdf')).toBe('asdf-asdf')
    expect(toSlug('asdf.asdf')).toBe('asdf-asdf')
  })

  it('should not end or start with replacement', () => {
    expect(toSlug('!tada!data!')).toBe('tada-data')
  })

  it('should not contain multiple replacements in sequence', () => {
    expect(toSlug('here !/= chars')).toBe('here-chars')
  })
})
