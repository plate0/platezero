import * as _ from 'lodash'
import { UserJSON } from '../models/user'
import { pickBy } from 'lodash'

export const getName = (user: UserJSON): string =>
  user.name ? user.name : user.username

export const normalize = <T extends {}>(model: T): T =>
  pickBy(model, (val: any) => val !== '') as T

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

export const uiToJSON = <T>(ui: UITrackable<T>): T => normalize(ui.json)
