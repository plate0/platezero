import React from 'react'
import * as _ from 'lodash'
import * as parseUrl from 'url-parse'

import { RecipeVersionJSON } from '../models'
import { toHoursAndMinutes } from '../common/time'

interface Props {
  recipeVersion: RecipeVersionJSON
}
export const RecipeVersionVitals = (props: Props) => {
  const vitals = _.flatten(
    _.map([duration, recipeYield, source, preheats], visit =>
      visit(props.recipeVersion)
    )
  )
  if (!vitals.length) {
    return null
  }
  return (
    <ul className="list-inline">
      {vitals.map((vital, idx) => (
        <li className="list-inline-item text-muted" key={idx}>
          {vital}
        </li>
      ))}
    </ul>
  )
}

const preheats = (rv: RecipeVersionJSON) =>
  _.map(rv.preheats, ph => (
    <span className="text-danger">
      {ph.name} {ph.temperature} {ph.unit}
    </span>
  ))

const formatDuration = (seconds: number) => {
  const { h, m } = toHoursAndMinutes(seconds)
  const hs = `${h}h`
  const ms = `${m}m`
  if (h > 0) {
    return m !== 0 ? `${hs} ${ms}` : hs
  }
  return ms
}

const duration = (rv: RecipeVersionJSON) => {
  const d = _.get(rv, 'recipeDuration.duration_seconds')
  if (!d) {
    return []
  }
  return <>Takes {formatDuration(d)}</>
}

const recipeYield = (rv: RecipeVersionJSON) => {
  const y = _.get(rv, 'recipeYield.text')
  if (!y) {
    return []
  }
  return <>Yields {y}</>
}

const source = (rv: RecipeVersionJSON) => {
  const work = getWorkTitle(rv.recipe)
  if (!work) {
    return []
  }
  const link = getLink(rv.recipe)
  const src = link ? (
    <a href={link} target="_blank">
      {' '}
      {work}{' '}
    </a>
  ) : (
    work
  )
  return <>Adapted from {src}</>
}

// piece together the full display of the work, either "[work] by [author]", or
// if only one of the two is provided then "[work]" or "[author]" respectively.
// if neither is present, than we'll just get undefined.
function getWorkTitle(recipe: RecipeJSON) {
  const { source_url, source_title, source_author } = recipe
  if (source_title && source_author) {
    return `${source_title} by ${source_author}`
  }
  if (source_title) {
    return source_title
  }
  if (source_author) {
    return source_author
  }
  if (source_url) {
    return parseUrl(source_url).hostname
  }
  return undefined
}

// if the recipe has a source url, return that. otherwise, if it has a source
// isbn, return a link to a duckduckgo search for the isbn. otherwise, simply
// return nothing
function getLink(recipe: RecipeJSON) {
  const { source_url, source_isbn } = recipe
  if (source_url) {
    return source_url
  }
  if (source_isbn) {
    return `https://duck.com/?q=${encodeURIComponent('isbn ' + source_isbn)}`
  }
  return undefined
}
