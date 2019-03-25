import React from 'react'
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  Col,
  Input,
  Row
} from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'
import { ProcedureListPatch } from '../common/request-models'
import { UITrackable, uiToJSON, jsonToUI } from '../common/model-helpers'

interface Props {
  procedureList?: ProcedureListJSON
  onChange?: (list: ProcedureListJSON) => void
  onPatch?: (patch: ProcedureListPatch) => void

  onRemove?: () => void
}

interface State {
  name?: string
  lines: UITrackable<ProcedureLineJSON>[]
}

export class ProcedureList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.getPatch = this.getPatch.bind(this)
    this.state = props.procedureList
      ? {
          name: props.procedureList.name,
          lines: _.map(props.procedureList.lines, jsonToUI)
        }
      : {
          lines: [
            { json: { text: '' }, added: true, changed: false, removed: false }
          ]
        }
  }

  public getPatch() {
    return {
      procedureListId: _.get(this.props.procedureList, 'id'),
      addedSteps: _.map(_.filter(this.state.lines, { added: true }), uiToJSON),
      changedSteps: _.map(
        _.filter(this.state.lines, { changed: true }),
        uiToJSON
      ),
      removedStepIds: _.map(_.filter(this.state.lines, { removed: true }), 'id')
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
          {this.state.lines.map((s, key) => (
            <Row key={key}>
              <Col className="mb-3">
                <Input
                  key={key}
                  type="textarea"
                  placeholder="Step by step instructions..."
                  value={s.json.text}
                  onChange={e => this.replaceLine(key, e.target.value)}
                />
              </Col>
            </Row>
          ))}
        </CardBody>
        <CardFooter>
          <ButtonGroup>
            <Button
              type="button"
              color="secondary"
              size="sm"
              onClick={() =>
                this.setState(
                  state => ({
                    lines: [
                      ...state.lines,
                      {
                        json: { text: '' },
                        added: true,
                        changed: false,
                        removed: false
                      }
                    ]
                  }),
                  this.notifyChange
                )
              }
            >
              Add Step
            </Button>
            <Button
              type="button"
              color="secondary"
              size="sm"
              onClick={() =>
                _.isFunction(this.props.onRemove)
                  ? this.props.onRemove()
                  : _.noop()
              }
            >
              Remove Section
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    )
  }
}
