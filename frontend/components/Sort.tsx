import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

export interface SortBy {
  name: string
  value: string
}

export interface SortProps {
  selected: string
  by: SortBy[]
  onSort: (e: React.MouseEvent<HTMLButtonElement>) => any
}

export const Sort = ({ selected, by, onSort }: SortProps) => (
  <UncontrolledDropdown>
    <DropdownToggle caret color="link" style={{ color: 'black' }}>
      Sort
    </DropdownToggle>
    <DropdownMenu right>
      {by.map((b, i) => (
        <DropdownItem
          key={i}
          active={selected === b.value}
          value={b.value}
          onClick={onSort}
        >
          {b.name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
)

const sortBy = (by: SortBy[]) => props => <Sort {...props} by={by} />

export const SortRecipes = sortBy([
  { name: 'Name A-Z', value: 'title-asc' },
  { name: 'Name Z-A', value: 'title-desc' },
  { name: 'Newest', value: 'created_at-desc' },
  { name: 'Oldest', value: 'created_at-asc' }
])
