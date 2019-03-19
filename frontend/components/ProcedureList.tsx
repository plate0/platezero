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
  steps: ProcedureLineJSON[]
}

export class ProcedureList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceStep = this.replaceStep.bind(this)
    this.state = props.procedureList
      ? props.procedureList
      : {
          steps: [{ text: '' }]
        }
  }

  public notifyChange() {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
  }

  public replaceStep(idx: number, text: string): void {
    this.setState(
      state => ({
        steps: _.map(state.steps, (line, i) =>
          Object.assign(line, i === idx ? { text } : undefined)
        )
      }),
      this.notifyChange
    )
  }

  public render() {
    return (
      <div>
        {this.state.steps.map((s, key) => (
          <Row key={key}>
            <Col className="mb-3">
              <Input
                key={key}
                type="textarea"
                placeholder="Step by step instructions..."
                value={s.text}
                onChange={e => this.replaceStep(key, e.target.value)}
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
              state => ({ steps: [...state.steps, { text: '' }] }),
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
