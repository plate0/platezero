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
  const url = rv.recipe.source_url
  if (!url) {
    return []
  }
  return (
    <>
      Adapted from{' '}
      <a href={url} target="_blank">
        {parseUrl(url).hostname}
      </a>
    </>
  )
}
