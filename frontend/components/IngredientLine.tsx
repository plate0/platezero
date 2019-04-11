import React, { useState, useEffect } from 'react'
import Fraction from 'fraction.js'
import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import * as _ from 'lodash'

import { PlainInput, PlainSelect } from './PlainInput'
import { Units } from '../common'
import { Amount } from './Amount'
import { IngredientLineJSON } from '../models/ingredient_line'
import { usePrevious } from '../hooks/usePrevious'

function ingredientAmountString(line: IngredientLineJSON): string {
  if (_.isNil(line.quantity_numerator) || _.isNil(line.quantity_denominator)) {
    return ''
  }
  try {
    return new Fraction(
      line.quantity_numerator,
      line.quantity_denominator
    ).toFraction(true)
  } catch {
    return ''
  }
}

interface FractionAmount {
  n: number | undefined
  d: number | undefined
}

function parseFraction(s: string): FractionAmount | undefined {
  try {
    const f = new Fraction(s)
    const { n, d } = f
    return { n, d }
  } catch {
    return { n: undefined, d: undefined }
  }
}

function fractionMatchesIngredient(
  frac: FractionAmount,
  ing: IngredientLineJSON
): boolean {
  const [n, d] = [ing.quantity_numerator, ing.quantity_denominator]
  return (
    ((_.isNil(frac.n) && _.isNil(n)) || frac.n === n) &&
    ((_.isNil(frac.d) && _.isNil(d)) || frac.d === d)
  )
}

interface Props {
  ingredient: IngredientLineJSON
  onChange?: (ingredient: IngredientLineJSON) => void
  removed?: boolean
  changed?: boolean
  added?: boolean
}

export function IngredientLine(props: Props) {
  const onChange = _.isFunction(props.onChange) ? props.onChange : _.noop

  const bgClass = props.changed ? 'bg-changed' : props.added ? 'bg-added' : ''

  const setName = (name: string) => {
    onChange({ ...props.ingredient, name })
  }

  const setPreparation = (preparation: string) => {
    onChange({ ...props.ingredient, preparation })
  }

  const setOptional = (optional: boolean) => {
    onChange({ ...props.ingredient, optional })
  }

  const [amount, setAmount] = useState(ingredientAmountString(props.ingredient))
  const [frac, setFrac] = useState(parseFraction(amount))
  const prevFrac = usePrevious(frac)

  useEffect(() => {
    setFrac(parseFraction(amount))
  }, [amount])

  useEffect(() => {
    if (_.isUndefined(prevFrac)) {
      return
    }
    if (fractionMatchesIngredient(frac, props.ingredient)) {
      return
    }
    if (_.get(prevFrac, 'n') !== frac.n || _.get(prevFrac, 'd') !== frac.d) {
      onChange({
        ...props.ingredient,
        quantity_numerator: frac.n,
        quantity_denominator: frac.d
      })
    }
  }, [frac])

  useEffect(() => {
    if (!fractionMatchesIngredient(frac, props.ingredient)) {
      setAmount(ingredientAmountString(props.ingredient))
    }
  }, [
    props.ingredient.quantity_numerator,
    props.ingredient.quantity_denominator
  ])

  const unit = _.find(Units, { value: props.ingredient.unit }) || null
  const setUnit = (unit: string) => {
    onChange({ ...props.ingredient, unit })
  }

  if (props.removed) {
    return (
      <Row className="text-muted" noGutters={true}>
        <Col xs="auto" md="2" className="text-strike pl-3">
          <Amount
            numerator={props.ingredient.quantity_numerator}
            denominator={props.ingredient.quantity_denominator}
          />
        </Col>
        <Col xs="auto" md="2" className="text-strike pl-3">
          {props.ingredient.unit}
        </Col>
        <Col xs="auto" md={true} className="text-strike pl-3">
          {props.ingredient.name}
        </Col>
        <Col xs="auto" md="3" className="text-strike pl-3">
          {props.ingredient.preparation}
        </Col>
        <Col xs="auto">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={!!props.ingredient.optional}
                disabled
              />
              <small>Optional</small>
            </Label>
          </FormGroup>
        </Col>
      </Row>
    )
  }

  return (
    <Row noGutters={true} className={bgClass + ' mb-3'}>
      <Col xs="12" md="2">
        <PlainInput
          type="text"
          placeholder="e.g. 2/3"
          value={amount}
          onChange={e => {
            const amount = e.currentTarget.value
            setAmount(amount)
          }}
        />
      </Col>
      <Col xs="12" md="2">
        <PlainSelect
          options={Units}
          placeholder="e.g. cup"
          value={unit}
          onChange={(e: any) => setUnit(e.value)}
        />
      </Col>
      <Col xs="12" md={true}>
        <PlainInput
          type="text"
          placeholder="e.g. onions"
          value={props.ingredient.name || ''}
          onChange={e => {
            const name = e.currentTarget.value
            setName(name)
          }}
        />
      </Col>
      <Col xs="12" md="3">
        <PlainInput
          type="text"
          placeholder="e.g. diced"
          value={props.ingredient.preparation || ''}
          onChange={e => {
            const preparation = e.currentTarget.value
            setPreparation(preparation)
          }}
        />
      </Col>
      <Col xs="12" md="auto" className="d-flex align-items-center">
        <FormGroup check>
          <Label className="m-0" check>
            <Input
              type="checkbox"
              checked={!!props.ingredient.optional}
              onChange={e => {
                const optional = e.currentTarget.checked
                setOptional(optional)
              }}
            />
            <small>Optional</small>
          </Label>
        </FormGroup>
      </Col>
    </Row>
  )
}
