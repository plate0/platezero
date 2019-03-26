import React from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import { IngredientLine } from './IngredientLine'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import {
  UITrackable,
  uiToJSON,
  ItemPatch,
  formatItemPatch,
  removeItem,
  restoreItem,
  replaceItem
} from '../common/changes'

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
    patch?: ItemPatch<IngredientLineJSON>
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
      const patch = formatItemPatch(
        _.get(this.props.ingredientList, 'id'),
        this.state.lines
      )
      this.props.onChange(list, patch)
    }
  }

  public addIngredient() {
    const line = newIngredient()
    this.setState(
      state => ({ lines: [...state.lines, line] }),
      this.notifyChange
    )
  }

  public replaceLine(ingredient: IngredientLineJSON): void {
    this.setState(
      state => ({
        lines: replaceItem(state.lines, ingredient)
      }),
      this.notifyChange
    )
  }

  public removeLine(line: UITrackable<IngredientLineJSON>): void {
    this.setState(
      state => ({
        lines: removeItem(state.lines, line)
      }),
      this.notifyChange
    )
  }

  public restoreLine(line: UITrackable<IngredientLineJSON>): void {
    this.setState(
      state => ({
        lines: restoreItem(state.lines, line)
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
