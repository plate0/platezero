import React, { useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { noop } from 'lodash'
import {
  Input,
  InputGroup,
  InputGroupAddon,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button
} from 'reactstrap'
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share'

const ShareOptions = [
  {
    Component: TwitterShareButton,
    Icon: TwitterIcon
  },
  {
    Component: FacebookShareButton,
    Icon: FacebookIcon
  },
  {
    Component: RedditShareButton,
    Icon: RedditIcon
  },
  {
    Component: EmailShareButton,
    Icon: EmailIcon
  }
]

export interface ShareButtonProps {
  url: string
}

export const ShareButton = ({ url }: ShareButtonProps) => {
  const ref = useRef(null)
  const copyToClipboard = (e) => {
    ;(findDOMNode(ref.current) as HTMLInputElement).select()
    document.execCommand('copy')
    e.target.focus()
  }

  return (
    <UncontrolledDropdown direction="down">
      <DropdownToggle
        color="primary"
        className="rounded-circle btn-sm"
        style={{ height: 32, width: 32 }}
      >
        <i className="fal fa-share-square" />
      </DropdownToggle>
      <DropdownMenu right className="shadow p-0 m-0">
        <div className="p-3 share-dropdown">
          <InputGroup>
            <Input value={url} readOnly onChange={noop} ref={ref} />
            <InputGroupAddon addonType="append">
              <Button color="info" onClick={copyToClipboard}>
                <i className="fal fa-copy" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <hr />
          <div className="d-flex">
            {ShareOptions.map((share, key) => {
              const { Component, Icon } = share
              return React.createElement(
                Component,
                { url, key },
                <Button color="link">
                  <Icon size={32} round={true} />
                </Button>
              )
            })}
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}
