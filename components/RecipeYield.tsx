import React, { useState, useRef, useEffect } from 'react'
import { FormGroup, Label, Input } from 'reactstrap'
import * as _ from 'lodash'

import { RecipeYieldJSON } from '../models'

interface Props {
  yield: RecipeYieldJSON
  onChange?: (recipeYield: RecipeYieldJSON) => any
}
export function RecipeYield(props: Props) {
  const orig = useRef(props.yield)
  const [text, setText] = useState(_.get(props.yield, 'text') || '')
  const [model, setModel] = useState(props.yield)

  useEffect(() => {
    if (_.trim(text) === '') {
      setModel(undefined)
    } else {
      const origYield = _.get(orig.current, 'text')
      const result = {
        id: origYield === text ? _.get(orig.current, 'id') : undefined,
        text: _.trim(text)
      }
      setModel(result)
    }
  }, [text])

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(model)
    }
  }, [model])

  const added = model && !orig.current
  const changed = model ? !model.id : false
  return (
    <FormGroup>
      <Label>
        <h5>Yield</h5>
      </Label>
      <Input
        type="text"
        value={text}
        placeholder="e.g. 2 servings, 12 large muffins"
        onChange={(e) => setText(e.target.value)}
        className={added ? 'bg-added' : changed ? 'bg-changed' : ''}
      />
    </FormGroup>
  )
}
