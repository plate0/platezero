import React from 'react'
import Fraction from 'fraction.js'
import { Input } from 'reactstrap'

const DECIMAL = /(\d*)\.(\d*)/gm
const FRACTION = /(\d*)\/(\d*)/gm

export interface AmountInputState {
  value: number
  text: string
}

interface AmountInputProps {
  value: number
  tabIndex?: number
}

const fractionToDecimal = (fraction: string): number => {
  const [num, denom] = fraction.split(/\//)
  return parseFloat(num) / parseFloat(denom)
}

const parse = (s: string): number => {
  if (s.match(DECIMAL)) {
    return parseFloat(s)
  }
  if (s.match(FRACTION)) {
    console.log('Fraction!')
    const split = s.split(/\s+/g)
    if (split.length == 1) {
      return fractionToDecimal(s)
    } else if (split.length == 2) {
      const fraction = fractionToDecimal(split[1])
      return parseInt(split[0], 10) + fraction
    } else {
      return 0
    }
  }
  return parseInt(s)
}

export class AmountInput extends React.Component<
  AmountInputProps,
  AmountInputState
> {
  constructor(props: AmountInputProps) {
    super(props)
    this.state = {
      text: '',
      value: 0
    }
  }

  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(
      'Amount State',
      this.state.value,
      parse(e.currentTarget.value),
      new Fraction(parse(e.currentTarget.value))
    )
    this.setState({
      text: e.currentTarget.value,
      value: parse(e.currentTarget.value)
    })
    // emit.
  }

  public render() {
    return (
      <Input
        type="text"
        name="ingredientAmount"
        id="ingredientAmount"
        tabIndex={this.props.tabIndex}
        value={this.state.text}
        onChange={this.onChange}
        invalid={isNaN(this.state.value)}
        style={{
          paddingRight: 12,
          backgroundImage: 'none'
        }}
      />
    )
  }
}
