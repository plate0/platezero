import React from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import * as _ from 'lodash'

import { Units } from '../common'
import { FractionAmount, AmountInput } from './AmountInput'
import { Amount } from './Amount'
import { IngredientLineJSON } from '../models/ingredient_line'

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

  const bgColor = props.changed
    ? '#fff2cc'
    : props.added
    ? '#d6f5dd'
    : undefined

  const setName = (name: string) => {
    onChange({ ...props.ingredient, name })
  }

  const setPreparation = (preparation: string) => {
    onChange({ ...props.ingredient, preparation })
  }

  const setOptional = (optional: boolean) => {
    onChange({ ...props.ingredient, optional })
  }

  const amount = _.isNil(props.ingredient.quantity_numerator) ? undefined : {
    n: props.ingredient.quantity_numerator,
    d: props.ingredient.quantity_denominator
  }
  const setAmount = (amt: FractionAmount) => {
    console.log('setAmount', amt)
    if (_.isNil(amt)) {
      onChange({
        ...props.ingredient,
        quantity_numerator: undefined,
        quantity_denominator: undefined
      })
    } else {
      onChange({
        ...props.ingredient,
        quantity_numerator: amt.n,
        quantity_denominator: amt.d
      })
    }
  }

  const unit = _.find(Units, { value: props.ingredient.unit }) || null
  const setUnit = (unit: string) => {
    onChange({ ...props.ingredient, unit })
  }

  if (props.removed) {
    return (
      <Row className="text-muted">
        <Col xs="auto" className="d-flex align-items-center pr-0">
          <Button
            color="link"
            className="text-muted"
            title="Restore removed ingredient"
            onClick={onRestore}
          >
            <i className="fal fa-undo" />
          </Button>
        </Col>
        <Col xs="2" className="d-flex align-items-center text-strike">
          <Amount
            numerator={props.ingredient.quantity_numerator}
            denominator={props.ingredient.quantity_denominator}
          />
        </Col>
        <Col xs="2" className="d-flex align-items-center text-strike">
          {props.ingredient.unit}
        </Col>
        <Col className="d-flex align-items-center text-strike">
          {props.ingredient.name}
        </Col>
        <Col xs="3" className="d-flex align-items-center text-strike">
          {props.ingredient.preparation}
        </Col>
        <Col xs="1" className="d-flex align-items-center text-strike">
          {props.ingredient.optional ? 'optional' : undefined}
        </Col>
      </Row>
    )
  }

  return (
    <Row>
      <Col xs="auto" className="d-flex align-items-center pr-0">
        <Button
          color="link"
          className="text-secondary"
          title={props.changed ? 'Restore' : 'Remove'}
          onClick={() => (props.changed ? onRestore() : onRemove())}
        >
          <i className={`fal ${props.changed ? 'fa-undo' : 'fa-times'} pb-3`} />
        </Button>
      </Col>
      <Col xs="2">
        <FormGroup>
          <AmountInput
            className={bgClass}
            amount={amount}
            onChange={setAmount}
          />
        </FormGroup>
      </Col>
      <Col xs="2">
        <FormGroup>
          <Select
            options={Units}
            value={unit}
            onChange={(e: any) => setUnit(e.value)}
            className={bgClass}
            styles={{
              control: (base, state) => ({
                ...base,
                color: '#495057',
                borderColor: state.isFocused ? '#7adaef' : '#ced4da',
                boxShadow: state.isFocused
                  ? '0 0 0 0.2rem rgba(25, 175, 208, 0.25)'
                  : 'none',
                backgroundColor: bgColor,
                '&:hover': {
                  borderColor: state.isFocused ? '#7adaef' : '#ced4da'
                }
              })
            }}
          />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Input
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
      <Col xs="3">
        <FormGroup>
          <Input
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
      <Col xs="1" className="d-flex align-items-center">
        <FormGroup check className="mb-3">
          <Input
            type="checkbox"
            defaultChecked={props.ingredient.optional}
            className={bgClass}
            onChange={e => {
              const optional = e.currentTarget.checked
              setOptional(optional)
            }}
          />
          <Label className="m-0" check>
            <small>Optional</small>
          </Label>
        </FormGroup>
      </Col>
    </Row>
  )
}
