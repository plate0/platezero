import * as _ from 'lodash'
import { UserJSON } from '../models/user'
import { defaultUndefined } from './textutils'

export const getName = (user: UserJSON): string =>
  user.name ? user.name : user.username

export interface UITrackable<T> {
  json: T
  added: boolean
  changed: boolean
  removed: boolean
  original?: T
}

export const jsonToUI = <T>(json: T): UITrackable<T> => ({
  json,
  added: false,
  changed: false,
  removed: false,
  original: json
})

export const uiToJSON = <T>(ui: UITrackable<T>): T => {
  const val = { ...ui.json }
  _.each(_.keys(val), k => {
    val[k] = defaultUndefined(val[k])
  })
  return val
}
