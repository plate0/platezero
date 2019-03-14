import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'
import * as rfc6902 from 'rfc6902'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'

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

const defaultState: State = {
  list: {
    name: '',
    lines: [newIngredient()]
  },
  patch: []
}

export class IngredientList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.addIngredient = this.addIngredient.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.removeLine = this.removeLine.bind(this)
    this.state = Object.assign({}, defaultState, { list: props.ingredientList })
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

/**
 * Create a RFC6902 JSON patch for an edited ingredient list
 *
 * The patch generator that ships with the `rfc6902` package will try to make
 * diffs that only affect a very small part of the overall JSON document, and
 * by doing so, actually generates much larger and less-useful diffs than we
 * can trivially create ourselves.
 *
 * For example, if we remove an ingredient and add a new one, the default diff
 * algorithm will output a series of "replace" operations where the old
 * ingredient's name, quantity, etc, are all replaced with the new ingredient's
 * values. In fact, the equivalent but more meaningful representation for
 * PlateZero is to simply represent this as a "remove" operation followed by an
 * "add" operation with the value being the entire IngredientLine.
 *
 * We really only care about three things: (1) adding a new ingredient, (2)
 * removing an existing ingredient, and (3) editing an existing ingredient.
 */
const createIngredientListPatch = (
  orig: IngredientListJSON,
  curr: IngredientListJSON
): rfc6902.Patch => {
  const patch = []

  // Check for changes in the original lines
  _.each(orig.lines, (origLine, origIdx) => {
    const currLine = _.find(curr.lines, { id: origLine.id })

    // Check whether the original line has been removed
    if (!currLine) {
      patch.push({ op: 'remove', path: `/lines/${origIdx}` })
      return
    }

    // Check whether the original line has been changed
    if (!isSameIngredient(origLine, currLine)) {
      patch.push({
        op: 'replace',
        path: `/lines/${origIdx}`,
        value: _.omit(currLine, 'id')
      })
    }
  })

  // Check the current lines to see if any are newly added
  _.each(curr.lines, currLine => {
    if (currLine.id <= 0) {
      patch.push({ op: 'add', path: '/lines/-', value: _.omit(currLine, 'id') })
    }
  })
  return patch
}

const ingredientLineProps = [
  'name',
  'optional',
  'preparation',
  'quantity_numerator',
  'quantity_denominator',
  'unit'
]

const isSameIngredient = (
  a: IngredientLineJSON,
  b: IngredientLineJSON
): boolean =>
  _.reduce(
    ingredientLineProps,
    (result, prop) => result && a[prop] === b[prop],
    true
  )
