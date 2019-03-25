import React from 'react'
import { Card, CardBody, Button, Col, Input, Row } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'
import { ProcedureListPatch } from '../common/request-models'
import { ActionLine } from './ActionLine'
import { UITrackable, uiToJSON, jsonToUI } from '../common/model-helpers'

interface Props {
  procedureList?: ProcedureListJSON
  onChange?: (list: ProcedureListJSON) => void
  onPatch?: (patch: ProcedureListPatch) => void
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
    this.getPatch = this.getPatch.bind(this)
    this.state = props.procedureList
      ? {
          name: props.procedureList.name,
          lines: _.map(props.procedureList.lines, jsonToUI)
        }
      : { lines: [newProcedureLine()] }
  }

  public getPatch() {
    return {
      procedureListId: _.get(this.props.procedureList, 'id'),
      addedSteps: _.map(_.filter(this.state.lines, { added: true }), step =>
        _.omit(uiToJSON(step), 'id')
      ),
      changedSteps: _.map(
        _.filter(this.state.lines, { changed: true }),
        uiToJSON
      ),
      removedStepIds: _.map(
        _.filter(this.state.lines, { removed: true }),
        'json.id'
      )
    }
  }

  public notifyChange() {
    if (_.isFunction(this.props.onPatch)) {
      this.props.onPatch(this.getPatch())
    }
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange({
        name: undefined,
        lines: _.map(_.reject(this.state.lines, { removed: true }), uiToJSON)
      })
    }
  }

  public restoreLine(line: UITrackable<ProcedureLineJSON>): void {
    if (line.changed) {
      this.setState(
        state => ({
          lines: _.map(state.lines, l =>
            l.json.id === line.json.id
              ? {
                  changed: false,
                  added: l.added,
                  removed: false,
                  json: l.original,
                  original: l.original
                }
              : l
          )
        }),
        this.notifyChange
      )
      return
    }
    if (line.removed) {
      this.setState(
        state => ({
          lines: _.map(state.lines, l =>
            l.json.id === line.json.id
              ? {
                  ...l,
                  removed: false
                }
              : l
          )
        }),
        this.notifyChange
      )
      return
    }
  }

  public removeLine(line: UITrackable<ProcedureLineJSON>): void {
    if (line.added) {
      this.setState(
        state => ({
          lines: _.reject(state.lines, l => l.json.id === line.json.id)
        }),
        this.notifyChange
      )
    } else {
      this.setState(
        state => ({
          lines: _.map(state.lines, l =>
            l.json.id === line.json.id ? { ...l, removed: true } : l
          )
        }),
        this.notifyChange
      )
    }
  }

  public replaceLine(idx: number, text: string): void {
    this.setState(
      state => ({
        lines: _.map(state.lines, (line, i) =>
          i === idx
            ? {
                json: {
                  id: line.json.id,
                  text
                },
                changed: !line.added,
                added: line.added,
                removed: false,
                original: line.original
              }
            : line
        )
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
                  onChange={e => this.replaceLine(key, e.target.value)}
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
