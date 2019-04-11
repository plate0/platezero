import React, { useState, useEffect } from 'react'
import { Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap'
import * as moment from 'moment'
import * as _ from 'lodash'
import { toHoursAndMinutes } from '../common/time'

interface Props {
  seconds: number
  changed?: boolean
  added?: boolean
  onChange?: (seconds: number) => any
}
export function DurationInput(props: Props) {
  const { h, m } = toHoursAndMinutes(props.seconds)
  const [hours, setHours] = useState(h ? _.toString(h) : '')
  const [minutes, setMinutes] = useState(m ? _.toString(m) : '')

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      if (hours === '' && minutes === '') {
        props.onChange(undefined)
      } else {
        const h = _.toNumber(hours)
        const m = _.toNumber(minutes)
        props.onChange(moment.duration({ hours: h, minutes: m }).asSeconds())
      }
    }
  }, [hours, minutes])

  return (
    <FormGroup>
      <Label>Duration</Label>
      <Row>
        <Col>
          <Input
            type="number"
            placeholder="hours"
            value={hours}
            onChange={e => setHours(e.target.value)}
            className={
              props.added ? 'bg-added' : props.changed ? 'bg-changed' : ''
            }
          />
          <FormText color="muted">hours</FormText>
        </Col>
        <Col>
          <Input
            type="number"
            placeholder="minutes"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            className={
              props.added ? 'bg-added' : props.changed ? 'bg-changed' : ''
            }
          />
          <FormText color="muted">minutes</FormText>
        </Col>
      </Row>
    </FormGroup>
  )
}
