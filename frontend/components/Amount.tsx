import React from 'react'
import Fraction from 'fraction.js'
import * as _ from 'lodash'

interface AmountProps {
  numerator: number | undefined
  denominator: number | undefined
}

export const Amount = (props: AmountProps) => {
  try {
    const f = new Fraction(props.numerator, props.denominator)
    const text = f.equals(0)? "": f.toFraction(
      true
    )
    return <span>{text}</span>
  } catch {
    return <span />
  }
}
