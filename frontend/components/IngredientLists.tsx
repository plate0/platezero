import React from 'react'

import { IngredientListJSON, IngredientLineJSON } from '../models'
import { Amount } from './Amount'

const IngredientListLine = ({ line }: { line: IngredientLineJSON }) => {
  const parts = []
  if (line.quantity_numerator && line.quantity_denominator) {
    parts.push(
      <abbr title="recognized amount">
        <Amount
          numerator={line.quantity_numerator}
          denominator={line.quantity_denominator}
        />
      </abbr>
    )
  }
  if (line.unit) {
    parts.push(<abbr title="recognized unit of measure">{line.unit}</abbr>)
  }
  parts.push(line.name)
  if (line.preparation) {
    parts.push(<span className="text-info">{line.preparation}</span>)
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

const IngredientList = ({ list }: { list: IngredientListJSON }) => (
  <>
    {list.name && <p className="font-weight-bold border-bottom">{list.name}</p>}
    <ul className="list-unstyled">
      {list.lines.map((line, key) => (
        <IngredientListLine key={key} line={line} />
      ))}
    </ul>
  </>
)

export const IngredientLists = ({ lists }: { lists: IngredientListJSON[] }) => (
  <>
    {lists.map((list, key) => (
      <IngredientList list={list} key={key} />
    ))}
  </>
)
