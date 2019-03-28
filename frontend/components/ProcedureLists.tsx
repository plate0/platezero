import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ActionLine } from './ActionLine'
import {
  UITrackable,
  jsonToUI,
  uiToJSON,
  generateUITrackable,
  restore
} from '../common/changes'

const newProcedureList = generateUITrackable({
  id: undefined,
  name: '',
  lines: []
})

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (lists: ProcedureListJSON[]) => void
}

function setIndex<T>(items: T[], idx: number, item: T): T[] {
  const newItems = [...items]
  newItems[idx] = item
  return newItems
}

function setJSON<T>(
  items: UITrackable<T>[],
  idx: number,
  json: T
): UITrackable<T>[] {
  const newItems = [...items]
  newItems[idx].json = json
  return newItems
}

function dropIndex<T>(items: T[], idx: number): T[] {
  return _.reject(items, (_, i) => idx === i)
}

export function ProcedureLists(props: Props) {
  const [lists, setLists] = useState(jsonToUI(props.lists))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(uiToJSON(lists))
    }
  }, [lists])

  const addSectionBtn = (
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

  if (lists.length === 1) {
    return (
      <>
        <ProcedureList
          procedureList={lists[0].json}
          onChange={newList => setLists(setJSON(lists, 0, newList))}
          minimal={true}
        />
        {addSectionBtn}
      </>
    )
  }

  return (
    <>
      {lists.map((list, idx) =>
        list.removed ? (
          <RemovedProcedureList
            list={list.json}
            key={list.json.id}
            onRestore={() => setLists(setIndex(lists, idx, restore(list)))}
          />
        ) : (
          <ActionLine
            icon="fal fa-times"
            onAction={() => setLists(dropIndex(lists, idx))}
            key={list.json.id}
          >
            <ProcedureList
              procedureList={list.json}
              onChange={newList => setLists(setJSON(lists, idx, newList))}
            />
          </ActionLine>
        )
      )}
      {addSectionBtn}
    </>
  )
}

function RemovedProcedureList(props: {
  list: ProcedureListJSON
  onRestore?: () => void
}) {
  return (
    <ActionLine icon="fal fa-undo" onAction={props.onRestore}>
      <Card className="mb-3">
        <CardBody>
          {props.list.lines.map((line, key) => (
            <p key={key} className="text-muted text-strike">
              {line.text}
            </p>
          ))}
        </CardBody>
      </Card>
    </ActionLine>
  )
}
