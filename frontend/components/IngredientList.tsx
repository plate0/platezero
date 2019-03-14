import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'
import * as rfc6902 from 'rfc6902'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { createIngredientListPatch } from '../common/diff'

interface Props {
  onChange?: (ingredientList: IngredientListJSON, patch?: rfc6902.Patch) => void
  ingredientList?: IngredientListJSON
}

interface State {
  list: IngredientListJSON
  patch: rfc6902.Patch
}

let nextIngredientLineId = 0

const newIngredient = (): IngredientLineJSON => ({
  id: nextIngredientLineId--,
  quantity_numerator: undefined,
  quantity_denominator: undefined,
  name: '',
  preparation: '',
  optional: false,
  unit: ''
})

const newIngredientList = (): IngredientListJSON => ({
  name: '',
  lines: [newIngredient()]
})

export class IngredientList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.addIngredient = this.addIngredient.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.removeLine = this.removeLine.bind(this)
    this.state = {
      patch: [],
      list: props.ingredientList || newIngredientList()
    }
  }

  public notifyChange() {
    if (this.props.onChange) {
      const patch = createIngredientListPatch(
        this.props.ingredientList,
        this.state.list
      )
      console.log('patch', patch)
      this.props.onChange(this.state.list, patch)
    }
  }

  public addIngredient() {
    this.setState(
      state => ({
        ...state,
        list: {
          ...state.list,
          lines: [...state.list.lines, newIngredient()]
        }
      }),
      this.notifyChange
    )
  }

  public replaceLine(ingredient: IngredientLineJSON): void {
    this.setState(
      state => ({
        ...state,
        list: {
          ...state.list,
          lines: _.map(state.list.lines, line =>
            line.id === ingredient.id ? ingredient : line
          )
        }
      }),
      this.notifyChange
    )
  }

  public removeLine(id: number): void {
    this.setState(
      state => ({
        ...state,
        list: {
          ...state.list,
          lines: _.filter(state.list.lines, ingredient => ingredient.id !== id)
        }
      }),
      this.notifyChange
    )
  }

  public render() {
    return (
      <div>
        <Row>
          <Col xs="auto" className="pr-0">
            <button
              className="btn btn-link text-secondary invisible"
              onClick={e => e.preventDefault()}
            >
              <i className="fal fa-times invisible" />
            </button>
          </Col>
          <Col xs="2">
            <small>Amount</small>
          </Col>
          <Col xs="2">
            <small>Unit</small>
          </Col>
          <Col>
            <small>Ingredient</small>
          </Col>
          <Col xs="3">
            <small>Preparation</small>
          </Col>
          <Col xs="1" />
        </Row>
        {this.state.list.lines.map(ingredient => (
          <IngredientLine
            key={ingredient.id}
            ingredient={ingredient}
            onChange={newIngredient => this.replaceLine(newIngredient)}
            onRemove={() => this.removeLine(ingredient.id)}
          />
        ))}
        <Button outline color="secondary" onClick={this.addIngredient}>
          Add Another Ingredient
        </Button>
      </div>
    )
  }
}
