import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import * as _ from 'lodash'

import { IngredientListJSON } from '../models'
import { IngredientList } from './IngredientList'
import { ActionLine } from './ActionLine'
import { Amount } from './Amount'
import {
  jsonToUI,
  uiToJSON,
  generateUITrackable,
  removeItem,
  restoreItem,
  replaceItem
} from '../common/changes'

const newIngredientList = generateUITrackable({
  name: '',
  lines: []
})

interface Props {
  lists: IngredientListJSON[]
  onChange?: (lists: IngredientListJSON[]) => void
}

export function IngredientLists(props: Props) {
  const [lists, setLists] = useState(jsonToUI(props.lists))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(uiToJSON(lists))
    }
  }, [lists])

  const act = list => () => {
    const f = list.removed ? restoreItem : removeItem
    setLists(f(lists, list.id))
  }
  const addBtn = (
    <p>
      <Button
        color="secondary"
        size="sm"
        onClick={() => setLists([...lists, newIngredientList.next().value])}
      >
        Add Ingredient Section
      </Button>
    </p>
  )
  if (_.size(lists) === 1) {
    const list = _.head(lists)
    return (
      <>
        <IngredientList
          ingredientList={list.json}
          onChange={newList => setLists(replaceItem(lists, list.id, newList))}
        />
        {addBtn}
      </>
    )
  }

  return (
    <>
      {lists.map(list => (
        <ActionLine
          icon={`fal fa-${list.removed ? 'undo' : 'times'}`}
          onAction={act(list)}
          key={list.id}
        >
          {list.removed ? (
            <RemovedIngredientList list={list.json} />
          ) : (
            <IngredientList
              ingredientList={list.json}
              oneOfMany={true}
              onChange={newList =>
                setLists(replaceItem(lists, list.id, newList))
              }
            />
          )}
        </ActionLine>
      ))}
      {addBtn}
    </>
  )
}

function RemovedIngredientList(props: { list: IngredientListJSON }) {
  return (
    <Card className="mb-3">
      <CardBody>
        {props.list.lines.map((line, key) => (
          <p key={key} className="text-muted text-strike">
            <Amount
              numerator={line.quantity_numerator}
              denominator={line.quantity_denominator}
            />{' '}
            {line.unit} {line.name}
          </p>
        ))}
      </CardBody>
    </Card>
  )
}
