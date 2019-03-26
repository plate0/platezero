import * as _ from 'lodash'
import { normalize } from './model-helpers'

export interface UITrackable<T extends {}> {
  json: T
  added: boolean
  changed: boolean
  removed: boolean
  original?: T
}

export const jsonToUI = <T extends {}>(json: T): UITrackable<T> => ({
  json,
  added: false,
  changed: false,
  removed: false,
  original: json
})

export const uiToJSON = <T extends {}>(ui: UITrackable<T>): T =>
  normalize(ui.json)

export interface ItemPatch<T extends {}> {
  id: number
  addedItems: T[]
  changedItems: T[]
  removedItemIds: number[]
}

export function formatItemPatch<T extends {}>(
  id: number,
  items: UITrackable<T>[]
): ItemPatch<T> {
  return {
    id,
    addedItems: _.map(_.filter(items, { added: true }), item =>
      _.omit(uiToJSON(item), 'id')
    ),
    changedItems: _.map(_.filter(items, { changed: true }), uiToJSON),
    removedItemIds: _.map(_.filter(items, { removed: true }), 'json.id')
  }
}

/**
 * Given a list of UITrackable items, restore a single item. If the item has
 * been marked as removed, it will be marked as not removed. If the item has
 * been changed, its `json` property will be restored to the original value of
 * `json`
 */
export function restoreItem<T extends { id?: number }>(
  prevs: UITrackable<T>[],
  item: UITrackable<T>
): UITrackable<T>[] {
  if (item.removed) {
    return _.map(prevs, prev =>
      prev.json.id === item.json.id ? { ...prev, removed: false } : prev
    )
  }
  if (item.changed) {
    return _.map(prevs, prev =>
      prev.json.id === item.json.id
        ? {
            changed: false,
            added: prev.added,
            removed: false,
            json: prev.original,
            original: prev.original
          }
        : prev
    )
  }
  return prevs
}

/**
 * Given an list of UITrackable items, remove a single item. If the item has
 * been added, it will be omitted entirely. If it originally existed, it will
 * be marked for removal.
 */
export function removeItem<T extends { id?: number }>(
  prevs: UITrackable<T>[],
  item: UITrackable<T>
): UITrackable<T>[] {
  if (item.added) {
    return _.reject(prevs, prev => prev.json.id === item.json.id)
  }
  return _.map(prevs, prev =>
    prev.json.id === item.json.id ? { ...prev, removed: true } : prev
  )
}

/**
 * Given a list of UITrackable items, update a single item.
 */
export function replaceItem<T extends { id?: number }>(
  prevs: UITrackable<T>[],
  item: T
): UITrackable<T>[] {
  return _.map(prevs, prev =>
    prev.json.id === item.id
      ? {
          json: item,
          changed: !prev.added,
          added: prev.added,
          removed: false,
          original: prev.original
        }
      : prev
  )
}

export interface ListPatch<L extends {}, I extends {}> {
  addedItems: L[]
  changedItems: ItemPatch<I>[]
  removedIds: number[]
}

export function formatListPatch<L extends { id?: number }, I extends {}>(
  items: UITrackable<L>[],
  patches: { [id: number]: ItemPatch<I> }
): ListPatch<L, I> {
  const removedIds = _.map(
    _.filter(items, { removed: true }),
    item => item.json.id
  )
  const changedItems = _.reject(
    _.filter(_.values(patches), patch => _.indexOf(removedIds, patch.id) < 0),
    patch =>
      _.size(patch.addedItems) === 0 &&
      _.size(patch.changedItems) === 0 &&
      _.size(patch.removedItemIds) === 0
  )
  const addedItems = _.map(_.filter(items, { added: true }), uiToJSON)
  return { addedItems, changedItems, removedIds }
}
