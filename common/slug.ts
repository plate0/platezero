import slugify from 'slugify'
import * as _ from 'lodash'

export const toSlug = (s: string): string => {
  const replacement = '-'
  let slugged = slugify(s, { lower: true, remove: null, replacement })
  slugged = _.replace(slugged, /[^a-z0-9\-]/g, replacement)
  slugged = _.replace(slugged, /\-{2,}/g, replacement)
  return _.trim(slugged, replacement)
}
