import React from 'react'
import * as _ from 'lodash'

interface AmountProps {
  numerator: number | undefined
  denominator: number | undefined
}

export const Amount = (props: AmountProps) => {
  const n = props.numerator
  const d = props.denominator
  if (_.isNil(n) || _.isNil(d)) {
    return <span />
  }
  if (d === 1) {
    return <span>{n}</span>
  }
  return (
    <span>
      {n}/{d}
    </span>
  )
}
