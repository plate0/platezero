import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'

interface Props {
  onChange?: (ingredientList: IngredientListJSON) => void
}

interface State {
  name: string
  lines: IngredientLineJSON[]
}

const newIngredient = () => ({
  quantity_numerator: undefined,
  quantity_denominator: undefined,
  name: '',
  preparation: '',
  optional: false,
  unit: ''
})

export class NewIngredientList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.addIngredient = this.addIngredient.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceIngredient = this.replaceIngredient.bind(this)
    this.state = {
      name: '',
      lines: [newIngredient()]
    }
  }

  public notifyChange() {
    if (this.props.onChange) {
      this.props.onChange({
        ...this.state,
        name: this.state.name === '' ? undefined : this.state.name
      })
    }
  }

  public addIngredient() {
    this.setState(
      state => ({
        lines: [...state.lines, newIngredient()]
      }),
      this.notifyChange
    )
  }

  public replaceIngredient(idx: number, line: IngredientLineJSON): void {
    this.setState(state => {
      const lines = [...state.lines]
      lines[idx] = line
      return { lines }
    }, this.notifyChange)
  }

  public render() {
    return (
      <div>
        <Row>
          <Col xs="2">
            <small>Amount</small>
          </Col>
          <Col xs="2">
            <small>Unit</small>
          </Col>
          <Col xs="4">
            <small>Ingredient</small>
          </Col>
          <Col xs="3">
            <small>Preparation</small>
          </Col>
          <Col xs="1" />
        </Row>
        {this.state.lines.map((ingredient, key) => (
          <IngredientLine
            key={key}
            ingredient={ingredient}
            onChange={newIngredient =>
              this.replaceIngredient(key, newIngredient)
            }
          />
        ))}
        <Button
          type="button"
          outline
          color="secondary"
          onClick={this.addIngredient}
        >
          Add Another Ingredient
        </Button>
      </div>
    )
  }
}
