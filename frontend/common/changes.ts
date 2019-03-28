import * as _ from 'lodash'
import { normalize } from './model-helpers'

export interface UITrackable<T extends {}> {
  json: T
  added: boolean
  removed: boolean
  original?: T
}

export const jsonToUI = <T extends {}>(items: T[]): UITrackable<T>[] =>
  _.map(items, json => ({
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
export function restore<T extends { id?: number }>(
  item: UITrackable<T>
): UITrackable<T> {
  if (item.removed) {
    return { ...item, removed: false }
  }
  return {
    added: item.added,
    removed: false,
    json: item.original,
    original: item.original
  }
}

/**
 * Given a list of UITrackable items, restore a single specified item.
 */
export function restoreItem<T extends { id?: number }>(
  prevs: UITrackable<T>[],
  item: UITrackable<T>
): UITrackable<T>[] {
  return _.map(prevs, prev =>
    prev.json.id === item.json.id ? restore(prev) : prev
  )
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
          added: prev.added,
          removed: false,
          original: prev.original
        }
      : prev
  )
}

function addedItem<T extends { id?: number }>(json: T): UITrackable<T> {
  return { json, added: true, removed: false }
}

export function* generateUITrackable<T extends { id?: number }>(
  json: T
): IterableIterator<UITrackable<T>> {
  let nextId = 0
  while (true) {
    const id = nextId--
    yield addedItem({ ...json, id })
  }
}

export function hasModifiedItems<T>(items: UITrackable<T>[]): boolean {
  return _.reduce(
    items,
    (acc, item) => acc || isChanged(item) || item.added || item.removed,
    false
  )
}
