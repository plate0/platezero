import React from 'react'
import Fraction from 'fraction.js'
import { Input } from 'reactstrap'
import * as _ from 'lodash'

export interface FractionAmount {
  n: number | undefined
  d: number | undefined
}

const parse = (s: string): FractionAmount | undefined => {
  try {
    const f = new Fraction(s)
    const { n, d } = f
    return { n, d }
  } catch {
    return { n: undefined, d: undefined }
  }
}

const isValid = (f: FractionAmount): boolean =>
  !_.isNil(f) && !_.isNil(f.n) && !_.isNil(f.d)

const fractionToString = (amt: FractionAmount): string => {
  if (!isValid(amt)) {
    return ''
  }
  try {
    return new Fraction(amt).toFraction(true)
  } catch {
    return ''
  }
}

interface AmountInputProps {
  amount: FractionAmount
  onChange?: (amount: FractionAmount) => void
  tabIndex?: number
}

interface AmountInputState {
  text: string
  fraction: FractionAmount
  valid: boolean
}

export class AmountInput extends React.Component<
  AmountInputProps,
  AmountInputState
> {
  constructor(props: AmountInputProps) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      fraction: this.props.amount,
      text: fractionToString(this.props.amount),
      valid: isValid(this.props.amount)
    }
  }

  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value
    const fraction = parse(text)
    const valid = isValid(fraction)
    this.setState({ text, fraction, valid })
    if (this.props.onChange) {
      this.props.onChange(fraction)
    }
  }

  public render() {
    return (
      <Input
        type="text"
        name="ingredientAmount"
        tabIndex={this.props.tabIndex}
        value={this.state.text}
        onChange={this.onChange}
        valid={this.state.valid}
        placeholder="2/3…"
      />
    )
  }
}
