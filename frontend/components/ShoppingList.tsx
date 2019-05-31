import * as React from 'react'
import {
  Button,
  Input,
  ListGroup,
  ListGroupItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { ShoppingListJSON, ShoppingListItemJSON } from '../models'

export type AddItemHandler = (list: ShoppingListJSON) => any
export type ChangeHandler = (
  list: ShoppingListJSON,
  item: ShoppingListItemJSON,
  idx: number
) => any

export interface ShoppingListProps {
  list: ShoppingListJSON
  add: AddItemHandler
  complete: ChangeHandler
  remove: ChangeHandler
}

export const ShoppingList = ({
  list,
  add,
  complete,
  remove
}: ShoppingListProps) => (
  <>
    <div className="d-flex align-items-center justify-content-between">
      <h2 className="mb-0">{list.name}</h2>
      <Button color="link" onClick={() => add(list)}>
        <i className="far fa-plus" />
      </Button>
    </div>
    <ListGroup flush>
      {(list.items || []).map((item, key) => (
        <ListGroupItem key={key} className="d-flex align-items-center">
          <input
            className="mr-2"
            type="checkbox"
            checked={item.completed}
            onChange={() => complete(list, item, key)}
          />{' '}
          <div className="flex-fill">{item.name}</div>
          <UncontrolledDropdown>
            <DropdownToggle color="link">
              <i className="far fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => remove(list, item, key)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ListGroupItem>
      ))}
    </ListGroup>
  </>
)
