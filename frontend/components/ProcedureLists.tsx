import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ProcedureListPatch } from '../common/request-models'

interface UIProcedureList extends ProcedureListJSON {
  changed: boolean
  removed: boolean
  added: boolean
  original?: ProcedureListJSON
}

let nextProcedureListId = 0
const newProcedureList = (): UIProcedureList => ({
  id: nextProcedureListId--,
  name: '',
  lines: [{ text: '' }],

  changed: false,
  removed: false,
  added: true
})

const jsonToUI = (lists: ProcedureListJSON[]): UIProcedureList[] =>
  _.map(lists, list => ({
    ...list,
    changed: false,
    removed: false,
    added: false,
    original: list
  }))

const uiToJSON = (list: UIProcedureList): ProcedureListJSON =>
  _.omit(list, ['changed', 'removed', 'added', 'original'])

const formatPatch = (lists: UIProcedureList[]) => ({
  added: _.map(_.filter(lists, { added: true }), uiToJSON),
  changed: _.map(_.filter(lists, { changed: true }), uiToJSON),
  removed: _.map(_.filter(lists, { removed: true }), 'id')
})

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (
    added: ProcedureListJSON[],
    removed: number[],
    changed: ProcedureListPatch[]
  ) => void
}

export function ProcedureLists(props: Props) {
  const [lists, setLists] = useState(jsonToUI(props.lists))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      console.log('lists', formatPatch(lists))
      //props.onChange(addedLists, [], changedLists)
    }
  }, [lists])

  const addList = () => setLists([...lists, newProcedureList()])

  const removeList = id => {
    const oldList = _.find(lists, { id })
    if (_.get(oldList, 'added', false)) {
      setLists(_.reject(lists, { id }) as UIProcedureList[])
    } else {
      setLists(
        _.map(lists, list =>
          list.id === id ? { ...list, removed: true } : list
        )
      )
    }
  }

  const changeList = newList =>
    setLists(
      _.map(lists, list =>
        list.id === newList.id
          ? { ...newList, changed: false, removed: false, added: true }
          : list
      )
    )

  return (
    <>
      {lists.map(list => (
        <ProcedureList
          procedureList={list}
          key={list.id}
          onChange={list => changeList(list)}
          onRemove={() => removeList(list.id)}
        />
      ))}
      <p>
        <Button color="secondary" size="sm" onClick={() => addList()}>
          Add Instruction Section
        </Button>
      </p>
    </>
  )
}
