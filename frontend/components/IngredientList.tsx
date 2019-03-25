import React from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { IngredientListPatch } from '../common/request-models'
import { UITrackable, uiToJSON } from '../common/model-helpers'

let nextIngredientLineId = 0

const newIngredient = (): UITrackable<IngredientLineJSON> => ({
  json: {
    id: nextIngredientLineId--,
    quantity_numerator: undefined,
    quantity_denominator: undefined,
    name: '',
    preparation: '',
    optional: false,
    unit: ''
  },
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
  lines: UITrackable<IngredientLineJSON>[]
}

const fallbackToNewIngredientList = (ingredientList?: IngredientListJSON) => {
  if (ingredientList) {
    return {
      ...ingredientList,
      lines: _.map(ingredientList.lines, line => ({
        json: line,
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
      name: this.state.name,
      lines: _.map(this.state.lines, uiToJSON)
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
      'json.id'
    )
    const changedIngredients = _.map(
      _.filter(this.state.lines, { changed: true }),
      uiToJSON
    )
    const addedIngredients = _.map(
      _.filter(this.state.lines, { added: true }),
      uiToJSON
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
      const old = _.find(state.lines, l => l.json.id === ingredient.id)
      const newIngredient = old.added
        ? { json: ingredient, added: true, changed: false, removed: false }
        : {
            json: ingredient,
            added: false,
            changed: true,
            removed: false,
            original: old.original
          }
      return {
        lines: _.map(state.lines, line =>
          line.json.id === ingredient.id ? newIngredient : line
        )
      }
    }, this.notifyChange)
  }

  public removeLine(line: UITrackable<IngredientLineJSON>): void {
    this.setState(
      state => ({
        ...state,
        lines: line.added
          ? _.reject(state.lines, l => l.json.id === line.json.id)
          : _.map(state.lines, l =>
              l.json.id === line.json.id ? { ...line, removed: true } : l
            )
      }),
      this.notifyChange
    )
  }

  public restoreLine(line: UITrackable<IngredientLineJSON>): void {
    this.setState(
      state => ({
        ...state,
        lines: _.map(state.lines, l => {
          if (l.json.id !== line.json.id) {
            return l
          }
          return l.changed
            ? {
                json: l.original,
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
      <>
        {this.state.lines.map(ingredient => (
          <IngredientLine
            key={ingredient.json.id}
            ingredient={ingredient.json}
            onChange={newIngredient => this.replaceLine(newIngredient)}
            removed={ingredient.removed}
            added={ingredient.added}
            changed={ingredient.changed}
            onRemove={() => this.removeLine(ingredient)}
            onRestore={() => this.restoreLine(ingredient)}
          />
        ))}
        <Button color="secondary" size="sm" onClick={this.addIngredient}>
          Add Ingredient
        </Button>
      </>
    )
  }
}
