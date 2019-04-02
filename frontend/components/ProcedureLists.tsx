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
  id: undefined,
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

  // if (lists.length === 1) {
  //   const list = _.head(lists)
  //   return (
  //     <>
  //       <ProcedureList
  //         procedureList={list.json}
  //         onChange={newList => setLists(replaceItem(lists, list.id, newList))}
  //         minimal={true}
  //       />
  //       {addSectionBtn}
  //     </>
  //   )
  // }

  return (
    <>
      {lists.map(list =>
        list.removed ? (
          <RemovedProcedureList
            list={list.json}
            key={list.id}
            onRestore={() => setLists(restoreItem(lists, list.id))}
          />
        ) : (
          <ActionLine
            icon="fal fa-times"
            onAction={() => setLists(removeItem(lists, list.id))}
            key={list.id}
          >
            <ProcedureList
              procedureList={list.json}
              onChange={newList =>
                setLists(replaceItem(lists, list.id, newList))
              }
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
