import React from 'react'
import Fraction from 'fraction.js'
import * as _ from 'lodash'

interface Props {
  numerator: number | undefined
  denominator: number | undefined
  className?: string
}

export const Amount = ({ numerator, denominator, className }: Props) => {
  if (_.isNil(numerator) || _.isNil(denominator)) {
    return <span className={className} />
  }
  try {
    const text = new Fraction(numerator, denominator).toFraction(true)
    return <span className={className}>{text}</span>
  } catch {
    return <span className={className} />
  }
}
