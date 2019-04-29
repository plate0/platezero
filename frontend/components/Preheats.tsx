import React from 'react'
import * as _ from 'lodash'
import { PreheatJSON } from '../models'

export const Preheats = ({ preheats }: { preheats: PreheatJSON[] }) => (
  <ul className="list-unstyled">
    {_.map(preheats, (preheat, key) => (
      <li key={key}>
        <Preheat preheat={preheat} />
      </li>
    ))}
  </ul>
)

export const Preheat = ({ preheat }: { preheat: PreheatJSON }) => (
  <span className="badge badge-pill badge-danger">
    {preheat.name} {preheat.temperature} {preheat.unit}
  </span>
)
