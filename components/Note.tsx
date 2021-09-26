import Link from 'next/link'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Tooltip
} from 'reactstrap'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import { NoteJSON } from '../models'
import { IfLoggedIn } from './IfLoggedIn'
import { Markdown } from './Markdown'
import { Timestamp } from './Timestamp'

export const Note = ({
  note,
  versionLink,
  onDelete,
  onChange
}: {
  note: NoteJSON
  versionLink: string
  onDelete?: () => any
  onChange?: (newNote: NoteJSON) => any
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [isEditing, setEditing] = useState(false)
  const [text, setText] = useState(note.text)
  const ttid = useRef(`pin-tooltip-${note.id}`)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen)
  }

  const remove = async () => {
    try {
      await api.deleteNote(note.id)
      if (typeof onDelete === 'function') {
        onDelete()
      }
    } catch {}
  }

  const patch = async (p) => {
    try {
      const newNote = await api.patchNote(note.id, p)
      if (typeof onChange === 'function') {
        onChange({ ...note, ...newNote })
      }
    } catch {}
  }

  const togglePin = async () => {
    await patch({ pinned: !note.pinned })
  }

  const save = async () => {
    await patch({ text })
    setEditing(false)
  }

  return (
    <Card className="mb-3">
      <CardHeader className="text-muted py-1 px-2">
        <Row>
          <Col>
            <Link href={`/${note.author.username}`}>
              <a className="text-muted font-weight-bold">
                {getName(note.author)}
              </a>
            </Link>
            {versionLink ? (
              <>
                {' '}
                on{' '}
                <Link href={versionLink}>
                  <a className="text-underline text-muted">another version</a>
                </Link>
              </>
            ) : null}{' '}
            <Timestamp t={note.created_at} />
          </Col>
          <Col xs="auto">
            {note.pinned && (
              <>
                <i className="fas fa-thumbtack" id={ttid.current} />
                <Tooltip
                  placement="left"
                  isOpen={tooltipOpen}
                  target={ttid.current}
                  toggle={toggleTooltip}
                >
                  This note has been pinned
                </Tooltip>
              </>
            )}
            <IfLoggedIn username={note.author.username}>
              <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle color="link" className="text-secondary py-0">
                  <i className="fa fa-ellipsis-h" />
                </DropdownToggle>
                <DropdownMenu right>
                  {!isEditing && (
                    <DropdownItem onClick={() => setEditing(true)}>
                      Edit
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={togglePin}>
                    {note.pinned ? 'Un-pin note' : 'Pin note to top'}
                  </DropdownItem>
                  <DropdownItem
                    cssModule={{ 'dropdown-item': 'dropdown-item-danger' }}
                    onClick={remove}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </IfLoggedIn>
          </Col>
        </Row>
      </CardHeader>
      {isEditing ? (
        <>
          <TextareaAutosize
            value={text}
            className="form-control border-0"
            onChange={(e) => setText(e.target.value)}
            minRows={5}
          />
          <CardFooter className="text-right">
            <Button color="link" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={save}>
              Save
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardBody className="pb-0">
          <Markdown source={note.text} />
        </CardBody>
      )}
    </Card>
  )
}
