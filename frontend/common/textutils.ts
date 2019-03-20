import * as _ from 'lodash'

export function defaultUndefined<T>(val: T): T | undefined {
  if (_.isString(val)) {
    return _.isNil(val) || val === '' ? undefined : val
  }
  return _.isNil(val) ? undefined : val
}
