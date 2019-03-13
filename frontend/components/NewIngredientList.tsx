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
  ingredients: IngredientLineJSON[]
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
      ingredients: [newIngredient()]
    }
  }

  public notifyChange() {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
  }

  public addIngredient() {
    this.setState(
      state => ({
        ingredients: [...state.ingredients, newIngredient()]
      }),
      this.notifyChange
    )
  }

  public replaceIngredient(idx: number, ingredient: IngredientLineJSON): void {
    this.setState(state => {
      const ingredients = [...state.ingredients]
      ingredients[idx] = ingredient
      return { ingredients }
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
        {this.state.ingredients.map((ingredient, key) => (
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
