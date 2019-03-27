import * as _ from 'lodash'
import { UserJSON } from '../models/user'
import { pickBy } from 'lodash'

export const getName = (user: UserJSON): string =>
  user.name ? user.name : user.username

export const normalize = <T extends {}>(model: T): T =>
  pickBy(model, (val: any) =>
    _.isString(val) ? _.trim(val) !== '' && !_.isNil(val) : !_.isNil(val)
  ) as T
