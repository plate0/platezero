import React from 'react'
import { Button, Col, Input, Row } from 'reactstrap'
import * as _ from 'lodash'

import { ProcedureListJSON } from '../models'

interface Props {
  onChange?: (procedureList: ProcedureListJSON) => void
}

interface State {
  name: string
  steps: string[]
}

export class ProcedureList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.notifyChange = this.notifyChange.bind(this)
    this.replaceStep = this.replaceStep.bind(this)
    this.state = {
      name: '',
      steps: ['']
    }
  }

  public notifyChange() {
    if (this.props.onChange) {
      this.props.onChange({
        name: this.state.name,
        steps: _.map(this.state.steps, text => ({ text }))
      })
    }
  }

  public replaceStep(idx: number, newText: string): void {
    this.setState(
      state => ({
        steps: _.map(state.steps, (text, i) => (i === idx ? newText : text))
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
                value={s}
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
              state => ({ steps: [...state.steps, ''] }),
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
