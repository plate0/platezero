import React, { useState } from 'react'
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

  const onChange = () => {
    if (_.isFunction(props.onChange)) {
      props.onChange(addedLists, [], [])
    }
  }

  const removeAddedList = id => {
    setAddedLists(_.reject(addedLists, { id }), () => onChange())
  }

  const changeAddedList = (id, newList) => {
    setAddedLists(
      _.map(addedLists, list => (list.id === newList.id ? newList : list)),
      () => onChange()
    )
  }

  return (
    <>
      {props.lists.map(pl => (
        <ProcedureList procedureList={pl} key={pl.id} />
      ))}
      {_.map(addedLists, pl => (
        <ProcedureList
          procedureList={pl}
          key={pl.id}
          onRemove={() => removeAddedList(pl.id)}
          onChange={list => changeAddedList(pl.id, list)}
        />
      ))}
      <p>
        <Button
          color="secondary"
          size="sm"
          onClick={() => setAddedLists([...addedLists, newProcedureList()])}
        >
          Add Instruction Section
        </Button>
      </p>
    </>
  )
}
