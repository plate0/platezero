//import React, { useState, useEffect } from 'react'
//import { Button, Card, CardBody } from 'reactstrap'
//import * as _ from 'lodash'

import { IngredientListJSON } from '../models'
//import { IngredientList } from './IngredientList'
//import { ActionLine } from './ActionLine'
//import { jsonToUI, generateUITrackable } from '../common/changes'

//const newIngredientList = generateUITrackable({
//  id: undefined,
//  name: '',
//  lines: []
//})

interface Props {
  lists: IngredientListJSON[]
  onChange?: (list: IngredientListJSON) => void
}

export function IngredientLists(props: Props) {
  return <pre>IngredientLists {JSON.stringify(props)}</pre>
}

//export function IngredientLists(props: Props) {
//  const [lists, setLists] = useState(_.map(props.lists, jsonToUI))

//  useEffect(() => {
//    if (_.isFunction(props.onChange)) {
//      //props.onChange(formatListPatch(lists))
//    }
//  }, [lists])

//  const addSectionBtn = (
//    <p>
//      <Button
//        color="secondary"
//        size="sm"
//        onClick={() => setLists([...lists, newIngredientList.next().value])}
//      >
//        Add Ingredient Section
//      </Button>
//    </p>
//  )

//  if (lists.length < 2) {
//    return (
//      <>
//        <IngredientList ingredientList={lists[0].json} />
//        {addSectionBtn}
//      </>
//    )
//  }

//  return (
//    <>
//      {lists.map(list =>
//        list.removed ? (
//          <RemovedIngredientList
//            list={list.json}
//            key={list.json.id}
//            onRestore={() => {}}
//          />
//        ) : (
//          <ActionLine
//            icon="fal fa-times"
//            onAction={() => {}}
//            key={list.json.id}
//          >
//            <IngredientList ingredientList={list.json} />
//          </ActionLine>
//        )
//      )}
//      {addSectionBtn}
//    </>
//  )
//}

//function RemovedIngredientList(props: {
//  list: IngredientListJSON
//  onRestore?: () => void
//}) {
//  return (
//    <ActionLine icon="fal fa-undo" onAction={props.onRestore}>
//      <Card className="mb-3">
//        <CardBody>
//          <p>:(</p>
//        </CardBody>
//      </Card>
//    </ActionLine>
//  )
//}
