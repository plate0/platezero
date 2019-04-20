import * as moment from 'moment'
import * as _ from 'lodash'
// same name as recipe prop
export const title = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )

export const subtitle = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')

export const description = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')

export const ingredients = (s: string): string => s.replace(/^/gm, '* ')

export const procedures = (s: string): string => description(s)

export const yld = (s: string): string => title(s)
export { yld as yield }

export const duration = (s: string): string => {
  // TODO: Guess at unit with regex
  const n = _.toNumber(_.trim(s))
  if (_.isFinite(n)) {
    return moment.duration(n, 'minutes').toISOString()
  }
  return ''
}
