import React, { useState, useEffect } from 'react'
import { Col, FormGroup, Input, Label, Nav, NavItem, NavLink } from 'reactstrap'

interface Attribution {
  source_url: string
  source_title: string
  source_author: string
  source_isbn: string
}

enum WorkType {
  NONE,
  BOOK,
  WEBSITE,
  OTHER
}

// Given an Attribution, make a reasonable guess about which WorkType it is so
// we can highlight the correct tab.
function guessWorkType({
  source_url,
  source_title,
  source_author,
  source_isbn
}: Attribution): WorkType {
  if (source_isbn) {
    return WorkType.BOOK
  }
  if (source_url) {
    return WorkType.WEBSITE
  }
  if (source_title || source_author) {
    return WorkType.OTHER
  }
  return WorkType.NONE
}

interface Props extends Attribution {
  onChange?: (delta: Attribution) => any
}

export function RecipeAttributionEditor({
  source_url,
  source_title,
  source_author,
  source_isbn,
  onChange
}: Props) {
  const [url, setUrl] = useState(source_url || '')
  const [author, setAuthor] = useState(source_author || '')
  const [isbn, setIsbn] = useState(source_isbn || '')
  const [title, setTitle] = useState(source_title || '')
  const [workType, setWorkType] = useState(
    guessWorkType({ source_url, source_title, source_author, source_isbn })
  )

  useEffect(() => {
    switch (workType) {
      case WorkType.BOOK:
        setUrl('')
        break
      case WorkType.WEBSITE:
        setIsbn('')
        break
      case WorkType.NONE:
        setAuthor('')
        setTitle('')
        setUrl('')
        setIsbn('')
    }
  }, [workType])

  // call the onChange callback
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({
        source_url: url,
        source_title: title,
        source_author: author,
        source_isbn: isbn
      })
    }
  }, [url, author, isbn, title])

  return (
    <>
      <Nav pills className="small mb-3">
        <NavItem>
          <NavLink
            className={workType === WorkType.NONE ? 'active' : undefined}
            onClick={() => setWorkType(WorkType.NONE)}
            href="#"
          >
            None (Original Work)
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={workType === WorkType.BOOK ? 'active' : undefined}
            onClick={() => setWorkType(WorkType.BOOK)}
            href="#"
          >
            Adapted from Book
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={workType === WorkType.WEBSITE ? 'active' : undefined}
            onClick={() => setWorkType(WorkType.WEBSITE)}
            href="#"
          >
            Adapted from Website
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={workType === WorkType.OTHER ? 'active' : undefined}
            onClick={() => setWorkType(WorkType.OTHER)}
            href="#"
          >
            Other
          </NavLink>
        </NavItem>
      </Nav>

      {workType !== WorkType.NONE && (
        <div className="border pt-3 px-3 mb-3">
          <FormGroup row className="align-items-center small">
            <Label className="text-right py-0" sm={2}>
              Title
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                value={title}
                placeholder="e.g. The Joy of Cooking"
                onChange={(e) => setTitle(e.target.value)}
                bsSize="sm"
              />
            </Col>
          </FormGroup>

          <FormGroup row className="align-items-center small">
            <Label className="text-right py-0" sm={2}>
              Author
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                value={author}
                placeholder="e.g. Firstname Lastname"
                onChange={(e) => setAuthor(e.target.value)}
                bsSize="sm"
              />
            </Col>
          </FormGroup>

          {(workType === WorkType.WEBSITE || workType === WorkType.OTHER) && (
            <FormGroup row className="align-items-center small">
              <Label className="text-right py-0" sm={2}>
                Website URL
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  value={url}
                  placeholder="e.g. https://example.com/recipe.html"
                  onChange={(e) => setUrl(e.target.value)}
                  bsSize="sm"
                />
              </Col>
            </FormGroup>
          )}

          {(workType === WorkType.BOOK || workType === WorkType.OTHER) && (
            <FormGroup row className="align-items-center small">
              <Label className="text-right py-0" sm={2}>
                ISBN
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  value={isbn}
                  placeholder="e.g. 9780000000000"
                  onChange={(e) => setIsbn(e.target.value)}
                  bsSize="sm"
                />
              </Col>
            </FormGroup>
          )}
        </div>
      )}
    </>
  )
}
