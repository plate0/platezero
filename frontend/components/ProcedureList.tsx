import React from 'react'
import { Button, Col, Input, Row } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'

interface Props {
  procedureList?: ProcedureListJSON
  onChange?: (procedureList: ProcedureListJSON) => void
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
      <div>
        {_.map(this.state.lines, (s, key) => (
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
        <Button
          type="button"
          outline
          color="secondary"
          onClick={_ =>
            this.setState(
              state => ({ lines: [...state.lines, { text: '' }] }),
              this.notifyChange
            )
          }
        >
          Add Another Step
        </Button>
      </div>
    )
  }
}
