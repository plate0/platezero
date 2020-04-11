import * as _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  UncontrolledDropdown
} from 'reactstrap'
import { ShoppingListItemJSON, ShoppingListJSON } from '../models'
import { Blankslate } from './Blankslate'

export type ItemChangeHandler = (item: ShoppingListItemJSON) => any

const ShoppingListItem = ({
  item,
  delay,
  onChange,
  onRemove
}: {
  item: ShoppingListItemJSON
  delay: number
  onChange: ItemChangeHandler
  onRemove: ItemChangeHandler
}) => {
  const [completed, setCompleted] = useState(item.completed)
  const timer = useRef(undefined)

  useEffect(() => {
    if (completed != item.completed) {
      timer.current = setTimeout(() => onChange({ ...item, completed }), delay)
    } else {
      clearTimeout(timer.current)
    }
  }, [completed])

  return (
    <ListGroupItem className="d-flex align-items-center px-0">
      <FormGroup check className="flex-fill">
        <Label check className={`${completed ? 'text-muted' : ''}`}>
          <Input
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted(!completed)}
          />{' '}
          {item.name}
        </Label>
      </FormGroup>
      <UncontrolledDropdown>
        <DropdownToggle
          color="link"
          className="py-0"
          style={{ marginRight: '-.5rem' }}
        >
          <i className="far fa-ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => onRemove(item)}>Delete</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </ListGroupItem>
  )
}

export type AddItemHandler = (list: ShoppingListJSON) => any
export type ChangeHandler = (
  list: ShoppingListJSON,
  item: ShoppingListItemJSON
) => any

export interface ShoppingListProps {
  list: ShoppingListJSON
  onAdd: AddItemHandler
  onChange: ChangeHandler
  onRemove: ChangeHandler
}

export const ShoppingList = ({
  list,
  onAdd,
  onChange,
  onRemove
}: ShoppingListProps) => {
  const [showChecked, setShowChecked] = useState(false)
  const unchecked = _.reject(list.items, 'completed')
  const checked = _.filter(list.items, 'completed')
  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-0">{list.name}</h2>
        <Button className="pr-0" color="link" onClick={() => onAdd(list)}>
          <i className="far fa-plus" />
        </Button>
      </div>
      {_.size(list.items) == 0 && (
        <Blankslate>
          <p>Nothing Here Yet</p>
          <Button color="primary" onClick={() => onAdd(list)}>
            Add Item
          </Button>
        </Blankslate>
      )}
      <ListGroup flush>
        {unchecked.map(item => (
          <ShoppingListItem
            key={(item as any)._uuid}
            item={item}
            onChange={changed => onChange(list, changed)}
            onRemove={changed => onRemove(list, changed)}
            delay={1500}
          />
        ))}
      </ListGroup>
      {_.size(checked) > 0 && (
        <Button
          color="link"
          className="text-muted my-3"
          onClick={() => setShowChecked(!showChecked)}
        >
          <small>Show Completed Items</small>
        </Button>
      )}
      {showChecked && (
        <ListGroup flush>
          {checked.map(item => (
            <ShoppingListItem
              key={(item as any)._uuid}
              item={item}
              onChange={changed => onChange(list, changed)}
              onRemove={changed => onRemove(list, changed)}
              delay={0}
            />
          ))}
        </ListGroup>
      )}
    </>
  )
}
