import React from 'react'
import Fraction from 'fraction.js'
import * as _ from 'lodash'

interface Props {
  numerator: number | undefined
  denominator: number | undefined
}

export const Amount = ({ numerator, denominator }: Props) => {
  if (_.isNil(numerator) || _.isNil(denominator)) {
    return <span />
  }
  try {
    const text = new Fraction(numerator, denominator).toFraction(true)
    return <span>{text}</span>
  } catch {
    return <span />
  }
}
