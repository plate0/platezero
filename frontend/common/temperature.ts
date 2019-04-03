import * as _ from 'lodash'

interface Temperature {
  temperature: number
  unit: 'C' | 'F'
}

export function parseTemperature(temp: string): Temperature {
  const unit = /c\s*$/i.test(temp) ? 'C' : 'F'
  const digits = _.isNil(temp) ? '0' : _.head(temp.match(/[0-9]+/))
  const temperature = parseInt(digits || '0', 10)
  return { temperature, unit }
}
