import * as React from 'react'
import { Button, Input, ListGroup, ListGroupItem } from 'reactstrap'
import { ShoppingListJSON, ShoppingListItemJSON } from '../models'

export type AddItemHandler = (list: ShoppingListJSON) => any
export type CompleteHandler = (
  list: ShoppingListJSON,
  item: ShoppingListItemJSON,
  idx: number
) => any

export interface ShoppingListProps {
  list: ShoppingListJSON
  add: AddItemHandler
  complete: CompleteHandler
}

export const ShoppingList = ({ list, add, complete }: ShoppingListProps) => (
  <>
    <div className="d-flex align-items-center justify-content-between">
      <h2 className="mb-0">{list.name}</h2>
      <Button color="link" onClick={() => add(list)}>
        <i className="far fa-plus" />
      </Button>
    </div>
    <ListGroup flush>
      {(list.items || []).map((item, key) => (
        <ListGroupItem key={key}>
          <Input
            type="checkbox"
            checked={item.completed}
            onClick={() => complete(list, item, key)}
          />{' '}
          {item.name}
        </ListGroupItem>
      ))}
    </ListGroup>
  </>
)
