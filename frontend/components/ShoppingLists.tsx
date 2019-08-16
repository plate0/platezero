import * as React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { ShoppingListJSON } from '../models'
import { Link } from '../routes'

export const ShoppingLists = ({ lists }: { lists: ShoppingListJSON[] }) => (
  <ListGroup flush>
    {lists.map((list, key) => (
      <ListGroupItem key={key} className="px-0">
        <Link route="shopping-list" params={{ id: list.id }}>
          <a className="d-flex justify-content-between align-items-center text-dark font-weight-bold link-never-underline">
            <span>{list.name}</span>
            <i className="far fa-angle-right" />
          </a>
        </Link>
      </ListGroupItem>
    ))}
  </ListGroup>
)
