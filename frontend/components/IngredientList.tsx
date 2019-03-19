import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { IngredientListPatch } from '../common/request-models'

let nextIngredientLineId = 0

interface UIIngredientLine extends IngredientLineJSON {
  changed: boolean
  removed: boolean
  added: boolean

  // if changed === true, store a copy of the original values so they can be
  // reverted if desired
  original?: IngredientLineJSON
}

const newIngredient = (): UIIngredientLine => ({
  id: nextIngredientLineId--,
  quantity_numerator: undefined,
  quantity_denominator: undefined,
  name: '',
  preparation: '',
  optional: false,
  unit: '',
  changed: false,
  removed: false,
  added: true
})

interface Props {
  onChange?: (
    ingredientList: IngredientListJSON,
    patch?: IngredientListPatch
  ) => void
  ingredientList?: IngredientListJSON
}

interface State {
  name: string
  lines: UIIngredientLine[]
}

const fallbackToNewIngredientList = (ingredientList?: IngredientListJSON) => {
  if (ingredientList) {
    return {
      ...ingredientList,
      lines: _.map(ingredientList.lines, line => ({
        ...line,
        added: false,
        changed: false,
        removed: false,
        original: line
      }))
    }
  }
  return {
    name: '',
    lines: [newIngredient()]
  }
}

function defaultUndefined<T>(val: T): T | undefined {
  if (_.isString(val)) {
    return _.isNil(val) || val === '' ? undefined : val
  }
  return _.isNil(val) ? undefined : val
}

function uiLineToJSON(line: UIIngredientLine): IngredientLineJSON {
  return {
    ..._.omit(line, ['added', 'changed', 'removed', 'original']),
    name: defaultUndefined(line.name),
    preparation: defaultUndefined(line.preparation),
    unit: defaultUndefined(line.unit),
    quantity_numerator: defaultUndefined(line.quantity_numerator),
    quantity_denominator: defaultUndefined(line.quantity_denominator)
  }
}

export class IngredientList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.addIngredient = this.addIngredient.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.getIngredientList = this.getIngredientList.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.removeLine = this.removeLine.bind(this)
    this.restoreLine = this.restoreLine.bind(this)
    this.getPatch = this.getPatch.bind(this)
    const list = fallbackToNewIngredientList(props.ingredientList)
    const { name, lines } = list
    this.state = { name, lines }
  }

  public getIngredientList(): IngredientListJSON {
    return {
      name: defaultUndefined(this.state.name),
      lines: _.map(this.state.lines, uiLineToJSON)
    }
  }

  public notifyChange() {
    if (_.isFunction(this.props.onChange)) {
      const list = this.getIngredientList()
      const patch = this.getPatch()
      this.props.onChange(list, patch)
    }
  }

  public getPatch(): IngredientListPatch | undefined {
    const ingredientListId = this.props.ingredientList
      ? this.props.ingredientList.id
      : undefined
    const removedIngredientIds = _.map(
      _.filter(this.state.lines, { removed: true }),
      'id'
    )
    const changedIngredients = _.map(
      _.filter(this.state.lines, { changed: true }),
      uiLineToJSON
    )
    const addedIngredients = _.map(
      _.filter(this.state.lines, { added: true }),
      uiLineToJSON
    )
    if (
      !removedIngredientIds.length &&
      !changedIngredients.length &&
      !addedIngredients.length
    ) {
      return undefined
    }
    return {
      ingredientListId,
      removedIngredientIds,
      changedIngredients,
      addedIngredients
    }
  }

  public addIngredient() {
    const line = newIngredient()
    this.setState(
      state => ({ ...state, lines: [...state.lines, line] }),
      this.notifyChange
    )
  }

  public replaceLine(ingredient: IngredientLineJSON): void {
    this.setState(state => {
      const old = _.find(state.lines, { id: ingredient.id })
      const newIngredient = old.added
        ? { ...ingredient, added: true, changed: false, removed: false }
        : { ...ingredient, added: false, changed: true, removed: false }
      return {
        ...state,
        lines: _.map(state.lines, line =>
          line.id === ingredient.id ? newIngredient : line
        )
      }
    }, this.notifyChange)
  }

  public removeLine(line: UIIngredientLine): void {
    this.setState(
      state => ({
        ...state,
        lines: line.added
          ? _.reject(state.lines, { id: line.id })
          : _.map(state.lines, l =>
              l.id === line.id ? { ...line, removed: true } : l
            )
      }),
      this.notifyChange
    )
  }

  public restoreLine(line: UIIngredientLine): void {
    this.setState(
      state => ({
        ...state,
        lines: _.map(state.lines, l => {
          if (l.id !== line.id) {
            return l
          }
          return l.changed
            ? {
                ...l.original,
                original: l.original,
                added: l.added,
                changed: false,
                removed: false
              }
            : { ...l, removed: false }
        })
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
            removed={ingredient.removed}
            added={ingredient.added}
            changed={ingredient.changed}
            onRemove={() => this.removeLine(ingredient)}
            onRestore={() => this.restoreLine(ingredient)}
          />
        ))}
        <Button outline color="secondary" onClick={this.addIngredient}>
          Add Another Ingredient
        </Button>
      </div>
    )
  }
}
