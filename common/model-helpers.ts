import * as _ from 'lodash'
import { UserJSON } from '../models'

export const getName = (user: UserJSON): string =>
  user.name ? user.name : user.username

export const normalize = (x) => {
  if (_.isArray(x)) {
    return _.map(x, normalize)
  }
  if (_.isObject(x)) {
    return _.mapValues(x as object, normalize)
  }
  if (_.isNil(x)) {
    return undefined
  }
  if (_.isString(x) && _.trim(x) === '') {
    return undefined
  }
  return x
}
