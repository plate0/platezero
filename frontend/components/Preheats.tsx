import React from 'react'
import * as _ from 'lodash'
import { PreheatJSON } from '../models'

export const Preheats = ({ preheats }: { preheats: PreheatJSON[] }) => (
  <ul>
    {_.map(preheats, (preheat, key) => (
      <li key={key}>
        <Preheat preheat={preheat} />
      </li>
    ))}
  </ul>
)

export const Preheat = ({ preheat }: { preheat: PreheatJSON }) => (
  <span className="text-danger">
    {preheat.name} {preheat.temperature} {preheat.unit}
  </span>
)
