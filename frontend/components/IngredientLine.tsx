import React from 'react'
import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import * as _ from 'lodash'

import { Units } from '../common'
import { FractionAmount, AmountInput } from './AmountInput'
import { IngredientLineJSON } from '../models/ingredient_line'

interface Props {
  onChange?: (ingredient: IngredientLineJSON) => void
  ingredient: IngredientLineJSON
}

export class IngredientLine extends React.Component<Props, IngredientLineJSON> {
  constructor(props) {
    super(props)
    this.onAmountChange = this.onAmountChange.bind(this)
    this.onUnitChange = this.onUnitChange.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.state = this.props.ingredient
  }

  public notifyChange(): void {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
  }

  public onAmountChange(amount: FractionAmount): void {
    this.setState(
      { quantity_numerator: amount.n, quantity_denominator: amount.d },
      this.notifyChange
    )
  }

  public onUnitChange(unit: string): void {
    this.setState(
      {
        unit
      },
      this.notifyChange
    )
  }

  public render() {
    return (
      <Row>
        <Col xs="2">
          <FormGroup>
            <AmountInput
              amount={{
                n: this.state.quantity_numerator,
                d: this.state.quantity_denominator
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
                value: this.state.unit
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
        <Col xs="4">
          <FormGroup>
            <Input
              type="text"
              placeholder="onion, head of lettuce, ground black pepper…"
              value={this.state.name || ''}
              onChange={e =>
                this.setState(
                  { name: e.currentTarget.value },
                  this.notifyChange
                )
              }
            />
          </FormGroup>
        </Col>
        <Col xs="3">
          <FormGroup>
            <Input
              type="text"
              placeholder="finely diced, cleaned, peeled…"
              value={this.state.preparation || ''}
              onChange={e =>
                this.setState(
                  { preparation: e.currentTarget.value },
                  this.notifyChange
                )
              }
            />
          </FormGroup>
        </Col>
        <Col xs="1" className="d-flex align-items-center">
          <FormGroup check className="mb-3">
            <Input
              type="checkbox"
              defaultChecked={this.state.optional}
              onChange={e =>
                this.setState(
                  { optional: e.currentTarget.checked },
                  this.notifyChange
                )
              }
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
