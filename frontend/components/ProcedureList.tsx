import React from 'react'
import { Card, CardBody, Button, Col, Input, Row } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'
import { ActionLine } from './ActionLine'
import {
  UITrackable,
  uiToJSON,
  jsonToUI,
  ItemPatch,
  formatItemPatch,
  restoreItem,
  removeItem,
  replaceItem
} from '../common/changes'

interface Props {
  procedureList?: ProcedureListJSON
  onChange?: (list: ProcedureListJSON) => void
  onPatch?: (patch: ItemPatch<ProcedureLineJSON>) => void
}

interface State {
  name?: string
  lines: UITrackable<ProcedureLineJSON>[]
}

let nextProcedureLineId = 0
const newProcedureLine = (): UITrackable<ProcedureLineJSON> => ({
  json: {
    id: nextProcedureLineId--,
    text: ''
  },
  added: true,
  changed: false,
  removed: false
})

export class ProcedureList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.restoreLine = this.restoreLine.bind(this)
    this.removeLine = this.removeLine.bind(this)
    this.state = props.procedureList
      ? {
          name: props.procedureList.name,
          lines: _.map(props.procedureList.lines, jsonToUI)
        }
      : { lines: [newProcedureLine()] }
  }

  public notifyChange() {
    if (_.isFunction(this.props.onPatch)) {
      const patch = formatItemPatch(
        _.get(this.props.procedureList, 'id'),
        this.state.lines
      )
      this.props.onPatch(patch)
    }
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange({
        name: undefined,
        lines: _.map(_.reject(this.state.lines, { removed: true }), uiToJSON)
      })
    }
  }

  public restoreLine(line: UITrackable<ProcedureLineJSON>): void {
    this.setState(
      state => ({
        lines: restoreItem(state.lines, line)
      }),
      this.notifyChange
    )
  }

  public removeLine(line: UITrackable<ProcedureLineJSON>): void {
    this.setState(
      state => ({ lines: removeItem(state.lines, line) }),
      this.notifyChange
    )
  }

  public replaceLine(id: number, text: string): void {
    this.setState(
      state => ({
        lines: replaceItem(state.lines, { id, text })
      }),
      this.notifyChange
    )
  }

  public render() {
    return (
      <Card className="mb-3">
        <CardBody>
          {this.state.lines.map((line, key) => {
            if (line.removed) {
              return (
                <ActionLine
                  icon="fal fa-undo"
                  key={key}
                  onAction={() => this.restoreLine(line)}
                >
                  <div className="text-muted text-strike">{line.json.text}</div>
                </ActionLine>
              )
            }
            return (
              <ActionLine
                icon={line.changed ? 'fal fa-undo' : 'fal fa-times'}
                onAction={() =>
                  line.changed ? this.restoreLine(line) : this.removeLine(line)
                }
                key={key}
              >
                <Input
                  type="textarea"
                  placeholder="Step by step instructions..."
                  className={`mb-3 ${line.changed ? 'bg-changed' : ''} ${
                    line.added ? 'bg-added' : ''
                  }`}
                  value={line.json.text}
                  onChange={e => this.replaceLine(line.json.id, e.target.value)}
                />
              </ActionLine>
            )
          })}
          <Row>
            <Col>
              <Button
                type="button"
                color="secondary"
                size="sm"
                onClick={() =>
                  this.setState(
                    state => ({
                      lines: [...state.lines, newProcedureLine()]
                    }),
                    this.notifyChange
                  )
                }
              >
                Add Step
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}
