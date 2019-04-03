import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ActionLine } from './ActionLine'
import {
  jsonToUI,
  uiToJSON,
  generateUITrackable,
  removeItem,
  restoreItem,
  replaceItem
} from '../common/changes'

const newProcedureList = generateUITrackable({
  name: '',
  lines: []
})

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (lists: ProcedureListJSON[]) => void
}

export function ProcedureLists(props: Props) {
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
        onClick={() => setLists([...lists, newProcedureList.next().value])}
      >
        Add Instruction Section
      </Button>
    </p>
  )

  if (_.size(lists) === 1) {
    const list = _.head(lists)
    return (
      <>
        <ProcedureList
          procedureList={list.json}
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
            <RemovedProcedureList list={list.json} />
          ) : (
            <ProcedureList
              procedureList={list.json}
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

function RemovedProcedureList(props: { list: ProcedureListJSON }) {
  return (
    <Card className="mb-3">
      <CardBody>
        {props.list.lines.map((line, key) => (
          <p key={key} className="text-muted text-strike">
            {line.text}
          </p>
        ))}
      </CardBody>
    </Card>
  )
}
