import React from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import * as _ from 'lodash'

import { Units } from '../common'
import { FractionAmount, AmountInput } from './AmountInput'
import { IngredientLineJSON } from '../models/ingredient_line'

interface Props {
  onChange?: (ingredient: IngredientLineJSON) => void
  onRemove?: () => void
  ingredient: IngredientLineJSON
}

interface State {
  ingredient: IngredientLineJSON
  removed: boolean
}

export class IngredientLine extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.onAmountChange = this.onAmountChange.bind(this)
    this.onUnitChange = this.onUnitChange.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.remove = this.remove.bind(this)
    this.state = {
      ingredient: this.props.ingredient,
      removed: false
    }
  }

  public notifyChange(): void {
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(this.state.ingredient)
    }
  }

  public remove(): void {
    this.setState({ removed: true }, () => {
      if (_.isFunction(this.props.onRemove)) {
        this.props.onRemove()
      }
    })
  }

  public onAmountChange(amount: FractionAmount): void {
    this.setState(
      state => ({
        ingredient: {
          ...state.ingredient,
          quantity_numerator: amount.n,
          quantity_denominator: amount.d
        }
      }),
      this.notifyChange
    )
  }

  public onUnitChange(unit: string): void {
    this.setState(
      state => ({
        ingredient: {
          ...state.ingredient,
          unit
        }
      }),
      this.notifyChange
    )
  }

  public render() {
    const ing = this.state.ingredient
    return (
      <Row className={this.state.removed ? 'text-muted' : ''}>
        <Col xs="auto" className="d-flex align-items-center pr-0">
          <Button color="link" className="text-secondary" onClick={this.remove}>
            <i className="fal fa-times pb-3" />
          </Button>
        </Col>
        <Col xs="2">
          <FormGroup>
            <AmountInput
              amount={{
                n: ing.quantity_numerator,
                d: ing.quantity_denominator
              }}
              onChange={this.onAmountChange}
            />
          </FormGroup>
        </Col>
        <Col xs="2">
          <FormGroup>
            <Select
              options={Units}
              value={_.find(Units, {
                value: ing.unit
              })}
              onChange={(e: any) => this.onUnitChange(e.value)}
              styles={{
                control: (base, state) => ({
                  ...base,
                  color: '#495057',
                  borderColor: state.isFocused ? '#7adaef' : '#ced4da',
                  boxShadow: state.isFocused
                    ? '0 0 0 0.2rem rgba(25, 175, 208, 0.25)'
                    : 'none',
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
              value={ing.name || ''}
              disabled={this.state.removed}
              onChange={e => {
                const name = e.currentTarget.value
                this.setState(
                  state => ({
                    ingredient: { ...state.ingredient, name }
                  }),
                  this.notifyChange
                )
              }}
            />
          </FormGroup>
        </Col>
        <Col xs="3">
          <FormGroup>
            <Input
              type="text"
              placeholder="finely diced, cleaned, peeled…"
              value={ing.preparation || ''}
              disabled={this.state.removed}
              onChange={e => {
                const preparation = e.currentTarget.value
                this.setState(
                  state => ({
                    ingredient: { ...state.ingredient, preparation }
                  }),
                  this.notifyChange
                )
              }}
            />
          </FormGroup>
        </Col>
        <Col xs="1" className="d-flex align-items-center">
          <FormGroup check className="mb-3">
            <Input
              type="checkbox"
              defaultChecked={ing.optional}
              disabled={this.state.removed}
              onChange={e => {
                const optional = e.currentTarget.checked
                this.setState(
                  state => ({
                    ingredient: { ...state.ingredient, optional }
                  }),
                  this.notifyChange
                )
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
}
