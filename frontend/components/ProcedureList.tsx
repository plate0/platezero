import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, Input, CardBody, Button, FormText } from 'reactstrap'
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
  oneOfMany?: boolean
  onChange?: (list: ProcedureListJSON) => void
}

const newProcedureLine = generateUITrackable({ text: '' })

export function ProcedureList(props: Props) {
  const orig = useRef(props.procedureList)
  const [name, setName] = useState(props.procedureList.name)
  const [lines, setLines] = useState(jsonToUI(props.procedureList.lines))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      const changedLines = hasModifiedItems(lines)
      const changedName = name !== orig.current.name
      const id = changedLines || changedName ? undefined : orig.current.id
      props.onChange({ id, name, lines: uiToJSON(lines) })
    }
  }, [name, lines])

  const act = line => () => {
    const f = line.removed ? restoreItem : removeItem
    setLines(f(lines, line.id))
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
        {!props.oneOfMany && (
          <FormText color="muted">
            Tip: If you just have one set of instructions, you can leave this
            blank!
          </FormText>
        )}
      </CardHeader>
      <CardBody>
        {lines.map(line => (
          <ActionLine
            icon={`fal fa-${line.removed ? 'undo' : 'times'}`}
            key={line.id}
            onAction={act(line)}
          >
            {line.removed ? (
              <div className="text-muted text-strike">{line.json.text}</div>
            ) : (
              <PlainInput
                type="textarea"
                placeholder="Step by step instructions..."
                className={`mb-3 ${isChanged(line) ? 'bg-changed' : ''} ${
                  line.added ? 'bg-added' : ''
                }`}
                value={line.json.text}
                onChange={e =>
                  setLines(
                    replaceItem(lines, line.id, {
                      id: line.json.id,
                      text: e.target.value
                    })
                  )
                }
              />
            )}
          </ActionLine>
        ))}
        <div>
          <Button
            type="button"
            color="secondary"
            size="sm"
            onClick={() => setLines([...lines, newProcedureLine.next().value])}
          >
            Add Step
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
