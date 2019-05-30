import * as React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { ShoppingListJSON } from '../models'
import { Link } from '../routes'

export const ShoppingLists = ({ lists }: { lists: ShoppingListJSON[] }) => (
  <ListGroup flush>
    {lists.map((list, key) => (
      <ListGroupItem key={key}>
        <Link route="shopping-list" params={{ id: list.id }}>
          <a>{list.name}</a>
        </Link>
      </ListGroupItem>
    ))}
  </ListGroup>
)
