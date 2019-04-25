import React from 'react'

import { IngredientListJSON, IngredientLineJSON } from '../models'
import { Amount } from './Amount'

const IngredientListLine = ({
  line,
  highlight
}: {
  line: IngredientLineJSON
  highlight: boolean
}) => {
  const parts = []
  if (line.quantity_numerator && line.quantity_denominator) {
    parts.push(
      <Amount
        className={highlight ? 'text-success' : ''}
        numerator={line.quantity_numerator}
        denominator={line.quantity_denominator}
      />
    )
  }
  if (line.unit) {
    parts.push(
      <span className={highlight ? 'text-success' : ''}>{line.unit}</span>
    )
  }
  parts.push(<>{line.name}</>)
  if (line.preparation) {
    parts.push(<span className="text-secondary">{line.preparation}</span>)
  }
  if (line.optional) {
    parts.push(<span className="badge badge-info">Optional</span>)
  }
  return (
    <li className="mb-2" itemProp="recipeIngredient">
      {parts.map((part, key) => (
        <span key={key}>{part} </span>
      ))}
    </li>
  )
}

const IngredientList = ({
  list,
  highlight
}: {
  list: IngredientListJSON
  highlight: boolean
}) => (
  <>
    {list.name && <p className="font-weight-bold border-bottom">{list.name}</p>}
    <ul className="list-unstyled">
      {list.lines.map((line, key) => (
        <IngredientListLine key={key} line={line} highlight={highlight} />
      ))}
    </ul>
  </>
)

export const IngredientLists = ({
  lists,
  highlight
}: {
  lists: IngredientListJSON[]
  highlight?: boolean
}) => (
  <>
    {lists.map((list, key) => (
      <IngredientList list={list} key={key} highlight={!!highlight} />
    ))}
  </>
)
