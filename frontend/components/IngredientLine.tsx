import React, { useState, useEffect } from 'react'
import Fraction from 'fraction.js'
import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import * as _ from 'lodash'

import { PlainInput, PlainSelect } from './PlainInput'
import { Units } from '../common'
import { Amount } from './Amount'
import { ActionLine } from './ActionLine'
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
  onRemove?: () => void
  onRestore?: () => void
  removed?: boolean
  changed?: boolean
  added?: boolean
}

export function IngredientLine(props: Props) {
  const onRestore = _.isFunction(props.onRestore) ? props.onRestore : _.noop
  const onRemove = _.isFunction(props.onRemove) ? props.onRemove : _.noop
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
      <ActionLine icon="fal fa-undo" onAction={onRestore}>
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
          <Col
            xs="auto"
            className={`text-strike ${
              props.ingredient.optional ? '' : 'invisible'
            }`}
          >
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  className={props.ingredient.optional ? '' : 'invisible'}
                />
                <small>Optional</small>
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </ActionLine>
    )
  }

  return (
    <ActionLine
      icon={props.changed ? 'fal fa-undo' : 'fal fa-times'}
      onAction={() => (props.changed ? onRestore() : onRemove())}
    >
      <Row noGutters={true}>
        <Col xs="12" md="2">
          <FormGroup>
            <PlainInput
              type="text"
              placeholder="2/3…"
              value={amount}
              className={bgClass}
              onChange={e => {
                const amount = e.currentTarget.value
                setAmount(amount)
              }}
            />
          </FormGroup>
        </Col>
        <Col xs="12" md="2">
          <FormGroup>
            <PlainSelect
              options={Units}
              placeholder="cup, gram…"
              value={unit}
              onChange={(e: any) => setUnit(e.value)}
              className={bgClass}
            />
          </FormGroup>
        </Col>
        <Col xs="12" md={true}>
          <FormGroup>
            <PlainInput
              type="text"
              placeholder="onion, head of lettuce, ground black pepper…"
              value={props.ingredient.name || ''}
              className={bgClass}
              onChange={e => {
                const name = e.currentTarget.value
                setName(name)
              }}
            />
          </FormGroup>
        </Col>
        <Col xs="12" md="3">
          <FormGroup>
            <PlainInput
              type="text"
              placeholder="finely diced, cleaned, peeled…"
              value={props.ingredient.preparation || ''}
              className={bgClass}
              onChange={e => {
                const preparation = e.currentTarget.value
                setPreparation(preparation)
              }}
            />
          </FormGroup>
        </Col>
        <Col xs="12" md="auto" className="d-flex align-items-center">
          <FormGroup check className="mb-3">
            <Label className="m-0" check>
              <Input
                type="checkbox"
                defaultChecked={props.ingredient.optional}
                className={bgClass}
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
    </ActionLine>
  )
}
