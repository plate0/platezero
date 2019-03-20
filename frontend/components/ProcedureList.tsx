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

interface Props {
  procedureList?: ProcedureListJSON
  onChange?: (procedureList: ProcedureListJSON) => void
  onRemove?: () => void
}

interface State {
  name?: string
  lines: ProcedureLineJSON[]
}

export class ProcedureList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceLine = this.replaceLine.bind(this)
    this.state = props.procedureList
      ? props.procedureList
      : {
          lines: [{ text: '' }]
        }
  }

  public notifyChange() {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
  }

  public replaceLine(idx: number, text: string): void {
    this.setState(
      state => ({
        lines: _.map(state.lines, (line, i) =>
          Object.assign(line, i === idx ? { text } : undefined)
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
                  value={s.text}
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
                  state => ({ lines: [...state.lines, { text: '' }] }),
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
