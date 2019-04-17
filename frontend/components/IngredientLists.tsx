import React from 'react'

import { IngredientListJSON, IngredientLineJSON } from '../models'
import { Amount } from './Amount'

const IngredientListLine = ({
  line,
  highlight
}: {
  line: IngredientLineJSON
  highlight: boolean
}) => (
  <li className="mb-2" itemProp="recipeIngredient">
    {line.quantity_numerator && line.quantity_denominator && (
      <span className={highlight ? 'text-success mr-1' : 'mr-1'}>
        <Amount
          numerator={line.quantity_numerator}
          denominator={line.quantity_denominator}
        />
      </span>
    )}
    {line.unit && (
      <span className={highlight ? 'text-success mr-1' : 'mr-1'}>
        {line.unit}
      </span>
    )}
    <span className="mr-1">{line.name}</span>
    {line.preparation && (
      <span className="text-secondary mr-1">{line.preparation}</span>
    )}
    {line.optional && <span className="badge badge-info ml-1">Optional</span>}
  </li>
)

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
