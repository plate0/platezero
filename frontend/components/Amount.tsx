import React from 'react'
import Fraction from 'fraction.js'
import * as _ from 'lodash'

interface AmountProps {
  numerator: number | undefined
  denominator: number | undefined
}

export const Amount = (props: AmountProps) => {
  try {
    const text = new Fraction(props.numerator, props.denominator).toFraction(true)
    console.log(text)
    return <span>{text}</span>
  } catch {
    return <span />
  }
}
