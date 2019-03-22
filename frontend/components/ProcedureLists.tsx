import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ProcedureListPatch } from '../common/request-models'
import { UITrackable, jsonToUI, uiToJSON } from '../common/model-helpers'

let nextProcedureListId = 0
const newProcedureList = (): UITrackable<ProcedureListJSON> => ({
  json: {
    id: nextProcedureListId--,
    name: '',
    lines: [{ text: '' }]
  },
  changed: false,
  removed: false,
  added: true
})

const formatPatch = (
  lists: UITrackable<ProcedureListJSON>[]
): ProcedureListsPatch => ({
  addedProcedureLists: _.map(_.filter(lists, { added: true }), uiToJSON),
  changedProcedureLists: [],
  removedProcedureListIds: _.map(_.filter(lists, { removed: true }), 'json.id')
})

interface ProcedureListsPatch {
  addedProcedureLists: ProcedureListJSON[]
  changedProcedureLists: ProcedureListPatch[]
  removedProcedureListIds: number[]
}

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (patch: ProcedureListsPatch) => void
}

export function ProcedureLists(props: Props) {
  const [lists, setLists] = useState(_.map(props.lists, jsonToUI))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(formatPatch(lists))
    }
  }, [lists])

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

  const changeList = newList =>
    setLists(
      _.map(lists, list => {
        if (list.json.id !== newList.id) {
          return list
        }
        if (list.added) {
          return { added: true, changed: false, removed: false, json: newList }
        }
        if (list.changed) {
          // TODO
        }
      })
    )

  return (
    <>
      {lists.map(list => (
        <ProcedureList
          procedureList={list.json}
          key={list.json.id}
          onChange={newList => changeList(newList)}
          onRemove={() => removeList(list.json.id)}
        />
      ))}
      <p>
        <Button color="secondary" size="sm" onClick={addList}>
          Add Instruction Section
        </Button>
      </p>
    </>
  )
}
