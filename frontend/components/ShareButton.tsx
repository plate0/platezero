import React from 'react'
import { noop } from 'lodash'
import {
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

const share = () => console.log('share!')

export interface ShareButtonProps {
  url: string
}

export const ShareButton = ({ url }: ShareButtonProps) => (
  <UncontrolledDropdown direction="down">
    <DropdownToggle color="primary">
      <i className="fal fa-share-square" />
    </DropdownToggle>
    <DropdownMenu right className="shadow">
      <div style={{ width: 300 }}>
        <Input value={url} readOnly onChange={noop} />
        Custom content.
        <h2>this is great</h2>
      </div>
    </DropdownMenu>
  </UncontrolledDropdown>
)
