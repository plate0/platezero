import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ActionLine } from './ActionLine'
import {
  UITrackable,
  jsonToUI,
  ListPatch,
  formatListPatch
} from '../common/changes'

let nextProcedureListId = 0
const newProcedureList = (): UITrackable<ProcedureListJSON> => ({
  json: {
    id: nextProcedureListId--,
    name: '',
    lines: []
  },
  changed: false,
  removed: false,
  added: true
})

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (patch: ListPatch<ProcedureListJSON, ProcedureLineJSON>) => void
}

export function ProcedureLists(props: Props) {
  const [lists, setLists] = useState(_.map(props.lists, jsonToUI))
  const [patches, setPatches] = useState({})

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(formatListPatch(lists, patches))
    }
  }, [lists, patches])

  const addList = () => setLists([...lists, newProcedureList()])

  const removeList = id => {
    const oldList = _.find(lists, list => list.json.id === id)
    if (_.get(oldList, 'added', false)) {
      setLists(_.reject(lists, list => list.json.id === id))
    } else {
      setLists(
        _.map(lists, list =>
          list.json.id === id ? { ...list, removed: true } : list
        )
      )
    }
  }

  const restoreList = id => {
    setLists(
      _.map(lists, list => {
        if (list.json.id !== id) {
          return list
        }
        if (list.removed) {
          return { ...list, removed: false }
        }
      })
    )
    setPatches(_.omit(patches, [id]))
  }

  const handlePatch = patch => {
    const old = _.find(lists, list => list.json.id === patch.id)
    if (old.added) {
      setLists(
        _.map(lists, list =>
          list.json.id === patch.id
            ? {
                json: {
                  id: list.json.id,
                  lines: patch.addedItems
                },
                added: true,
                changed: false,
                removed: false
              }
            : list
        )
      )
    } else {
      setPatches({ ...patches, [patch.id]: patch })
    }
  }

  return (
    <>
      {lists.map(list =>
        list.removed ? (
          <RemovedProcedureList
            list={list.json}
            key={list.json.id}
            onRestore={() => restoreList(list.json.id)}
          />
        ) : (
          <ActionLine
            icon="fal fa-times"
            onAction={() => removeList(list.json.id)}
            key={list.json.id}
          >
            <ProcedureList procedureList={list.json} onPatch={handlePatch} />
          </ActionLine>
        )
      )}
      <p>
        <Button color="secondary" size="sm" onClick={addList}>
          Add Instruction Section
        </Button>
      </p>
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
