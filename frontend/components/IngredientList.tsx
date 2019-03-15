import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'
import * as rfc6902 from 'rfc6902'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { IngredientListPatch } from '../common/diff'

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

interface UIIngredientLine extends IngredientLineJSON {
  changed: boolean
  removed: boolean
  added: boolean

  // if changed === true, store a copy of the original values so they can be
  // reverted if desired
  original?: IngredientLineJSON
}

interface Props {
  onChange?: (ingredientList: IngredientListJSON, patch?: rfc6902.Patch) => void
  ingredientList?: IngredientListJSON
}

interface State {
  lines: UIIngredientLine[]
  patch: IngredientListPatch
}

export class IngredientList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.addIngredient = this.addIngredient.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.removeLine = this.removeLine.bind(this)
    const list = props.ingredientList || newIngredientList()
    const patch = new IngredientListPatch(list)
    this.state = { name: list.name, lines: list.lines, patch }
  }

  public notifyChange() {
    if (this.props.onChange) {
      const patch = this.state.patch.getPatch()
      console.log('patch', patch)
      const { name, lines } = this.state
      this.props.onChange({ name, lines }, patch)
    }
  }

  public addIngredient() {
    const line = newIngredient()
    this.state.patch.addIngredient(line)
    this.setState(
      state => ({ ...state, lines: [...state.lines, line] }),
      this.notifyChange
    )
  }

  public replaceLine(ingredient: IngredientLineJSON): void {
    this.state.patch.replaceIngredient(ingredient.id, ingredient)
    this.setState(
      state => ({
        ...state,
        lines: _.map(state.lines, line =>
          line.id === ingredient.id ? ingredient : line
        )
      }),
      this.notifyChange
    )
  }

  public removeLine(id: number): void {
    this.state.patch.removeIngredient(id)
    this.setState(
      state => ({
        ...state,
        lines: _.map(state.lines, ingredient =>
          ingredient.id !== id ? ingredient : { ...ingredient, removed: true }
        )
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
        {this.state.lines.map(ingredient => (
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
