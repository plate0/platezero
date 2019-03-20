import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { ProcedureList } from './ProcedureList'
import { ProcedureListPatch } from '../common/request-models'

let nextProcedureListId = 0
const newProcedureList = (): ProcedureListJSON => ({
  id: nextProcedureListId--,
  name: '',
  lines: [{ text: '' }]
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
  console.log(props)
  const [addedLists, setAddedLists] = useState([])
  const [changedLists, setChangedLists] = useState([])

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(addedLists, [], changedLists)
    }
  }, [addedLists, changedLists])

  const addList = () => setAddedLists([...addedLists, newProcedureList()])

  const removeAddedList = id => setAddedLists(_.reject(addedLists, { id }))

  const changeAddedList = newList =>
    setAddedLists(
      _.map(addedLists, list => (list.id === newList.id ? newList : list))
    )

  const changeList = newList => {
    const alreadyChanged = _.find(changedLists, { id: newList.id })
    if (alreadyChanged) {
      setChangedLists(
        _.map(changedLists, list => (list.id === newList.id ? newList : list))
      )
    } else {
      setChangedLists([...changedLists, newList])
    }
  }

  return (
    <>
      {props.lists.map(pl => (
        <ProcedureList
          procedureList={pl}
          key={pl.id}
          onChange={list => changeList(list)}
        />
      ))}
      {_.map(addedLists, pl => (
        <ProcedureList
          procedureList={pl}
          key={pl.id}
          onRemove={() => removeAddedList(pl.id)}
          onChange={list => changeAddedList(list)}
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
