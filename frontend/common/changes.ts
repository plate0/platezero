import * as _ from 'lodash'
import { normalize } from './model-helpers'
import shortid from 'shortid'

export interface UITrackable<T extends {}> {
  id: string
  json: T
  added: boolean
  removed: boolean
  original?: T
}

export const jsonToUI = <T extends {}>(items: T[]): UITrackable<T>[] =>
  _.map(items, json => ({
    id: shortid.generate(),
    json,
    added: false,
    removed: false,
    original: json
  }))

export function isChanged<T extends {}>(item: UITrackable<T>): boolean {
  if (item.added) {
    return false
  }
  const [a, b] = _.map([item.json, item.original], x =>
    normalize(_.omit(x, 'id'))
  )
  return !_.isEqual(a, b)
}

export const uiToJSON = <T extends {}>(items: UITrackable<T>[]): T[] =>
  _.map(_.reject(items, { removed: true }), item => {
    const json = normalize(item.json)
    const changed = isChanged(item)
    return changed || item.added ? _.omit(json, ['id']) : json
  })

/**
 * Restore a single UITrackable. If the item has been marked as removed, it
 * will be marked as not removed. If the item has been changed, its `json`
 * property will be restored to the original value of `json`
 */
export function restore<T extends {}>(item: UITrackable<T>): UITrackable<T> {
  if (item.removed) {
    return { ...item, removed: false }
  }
  return {
    id: item.id,
    added: item.added,
    removed: false,
    json: item.original,
    original: item.original
  }
}

/**
 * Given a list of UITrackable items, restore a single specified item.
 */
export function restoreItem<T extends {}>(
  prevs: UITrackable<T>[],
  id: string
): UITrackable<T>[] {
  return _.map(prevs, prev => (prev.id === id ? restore(prev) : prev))
}

/**
 * Given an list of UITrackable items, remove a single item. If the item has
 * been added, it will be omitted entirely. If it originally existed, it will
 * be marked for removal.
 */
export function removeItem<T extends {}>(
  prevs: UITrackable<T>[],
  id: string
): UITrackable<T>[] {
  return _.compact(
    _.map(prevs, prev => {
      if (prev.id !== id) {
        return prev
      }
      if (prev.added) {
        return undefined
      }
      return { ...prev, removed: true }
    })
  )
}

/**
 * Given a list of UITrackable items, update a single item.
 */
export function replaceItem<T extends {}>(
  prevs: UITrackable<T>[],
  id: string,
  item: T
): UITrackable<T>[] {
  return _.map(prevs, prev =>
    prev.id === id
      ? {
          id,
          json: item,
          added: prev.added,
          removed: false,
          original: prev.original
        }
      : prev
  )
}

export function* generateUITrackable<T extends {}>(
  json: T
): IterableIterator<UITrackable<T>> {
  while (true) {
    const id = shortid.generate()
    yield { added: true, removed: false, json, id }
  }
}

export function hasModifiedItems<T>(items: UITrackable<T>[]): boolean {
  return _.reduce(
    items,
    (acc, item) => acc || isChanged(item) || item.added || item.removed,
    false
  )
}

export function setIndex<T>(items: T[], idx: number, item: T): T[] {
  const newItems = [...items]
  newItems[idx] = item
  return newItems
}

export function setJSON<T>(
  items: UITrackable<T>[],
  idx: number,
  json: T
): UITrackable<T>[] {
  const newItems = [...items]
  newItems[idx].json = json
  return newItems
}

export function dropIndex<T>(items: T[], idx: number): T[] {
  return _.reject(items, (_, i) => idx === i)
}
