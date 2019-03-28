import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, Input, CardBody, Button, Col, Row } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'
import { PlainInput } from './PlainInput'
import { ActionLine } from './ActionLine'
import {
  uiToJSON,
  jsonToUI,
  generateUITrackable,
  isChanged,
  restoreItem,
  removeItem,
  replaceItem,
  hasModifiedItems
} from '../common/changes'

interface Props {
  procedureList: ProcedureListJSON
  minimal?: boolean
  onChange?: (list: ProcedureListJSON) => void
}

const newProcedureLine = generateUITrackable({ id: undefined, text: '' })

export function ProcedureList(props: Props) {
  const originalId = useRef(props.procedureList.id)
  const [name, setName] = useState(props.procedureList.name)
  const [lines, setLines] = useState(jsonToUI(props.procedureList.lines))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      const changedLines = hasModifiedItems(lines)
      const changedName = name !== props.procedureList.name
      const id = changedLines || changedName ? undefined : originalId.current
      props.onChange({ id, name, lines: uiToJSON(lines) })
    }
  }, [name, lines])

  const linesOnly = (
    <>
      {lines.map((line, key) => {
        if (line.removed) {
          return (
            <ActionLine
              icon="fal fa-undo"
              key={key}
              onAction={() => setLines(restoreItem(lines, line))}
            >
              <div className="text-muted text-strike">{line.json.text}</div>
            </ActionLine>
          )
        }
        return (
          <ActionLine
            icon={isChanged(line) ? 'fal fa-undo' : 'fal fa-times'}
            onAction={() =>
              setLines(
                (isChanged(line) ? restoreItem : removeItem)(lines, line)
              )
            }
            key={key}
          >
            <PlainInput
              type="textarea"
              placeholder="Step by step instructions..."
              className={`mb-3 ${isChanged(line) ? 'bg-changed' : ''} ${
                line.added ? 'bg-added' : ''
              }`}
              value={line.json.text}
              onChange={e =>
                setLines(
                  replaceItem(lines, { id: line.json.id, text: e.target.value })
                )
              }
            />
          </ActionLine>
        )
      })}
      <Row>
        <Col>
          <p>
            <Button
              type="button"
              color="secondary"
              size="sm"
              onClick={() =>
                setLines([...lines, newProcedureLine.next().value])
              }
            >
              Add Step
            </Button>
          </p>
        </Col>
      </Row>
    </>
  )
  if (props.minimal) {
    return linesOnly
  }
  return (
    <Card className="mb-3">
      <CardHeader>
        <Input
          type="text"
          placeholder="Section Title, e.g. For the filling"
          value={name || ''}
          onChange={e => setName(e.target.value)}
        />
      </CardHeader>
      <CardBody>{linesOnly}</CardBody>
    </Card>
  )
}
