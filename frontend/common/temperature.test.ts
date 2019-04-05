import { parseTemperature } from './temperature'

describe('parse temperature', () => {
  it('should understand valid temperatures', () => {
    expect(parseTemperature('100c')).toEqual({ temperature: 100, unit: 'C' })
    expect(parseTemperature('  55 degrees')).toEqual({
      temperature: 55,
      unit: 'F'
    })
    expect(parseTemperature('20f')).toEqual({ temperature: 20, unit: 'F' })
    expect(parseTemperature('20 C')).toEqual({ temperature: 20, unit: 'C' })
  })

  it('should work with invalid inputs', () => {
    expect(parseTemperature('')).toEqual({ temperature: 0, unit: 'F' })
    expect(parseTemperature('    ')).toEqual({ temperature: 0, unit: 'F' })
    expect(parseTemperature(undefined)).toEqual({ temperature: 0, unit: 'F' })
    expect(parseTemperature(null)).toEqual({ temperature: 0, unit: 'F' })
  })
})
