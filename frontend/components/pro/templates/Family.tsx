import React, { useState } from 'react'
import { FormGroup, Label, Input, Card, Row, Col, Button } from 'reactstrap'
import { Help } from '../Help'
import { range } from 'lodash'

const help = `This helps us understand how much food you are going to need, a rough budget, and what sort of meals may be good for all members of your family.\n\nWe'll need more specifics about each family member later, but for now, we just want a quick overview.`

export const Family = ({ question, onAnswer }) => {
  const [a, c] = (question.answer || '').split(',')
  const [adults, setAdults] = useState(a || '1')
  const [children, setChildren] = useState(c || '0')

  const onSubmit = (e: React.FormEvent<EventTarget>) => {
    event.preventDefault()
    onAnswer({
      ...question,
      answer: `${adults},${children}`
    })
  }

  return (
    <Card body>
      <h3 className="font-weight-light">
        How many adults and children are in your family?
      </h3>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label for="adults">Adults</Label>
          <Input
            type="select"
            name="adults"
            id="adults"
            value={adults}
            onChange={e => setAdults(e.target.value)}
          >
            {range(1, 6).map(i => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="children">Children</Label>
          <Input
            type="select"
            name="children"
            id="children"
            value={children}
            onChange={e => setChildren(e.target.value)}
          >
            {range(0, 6).map(i => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Input>
        </FormGroup>
        <Help text={help} />
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button color="primary" value="submit">
              Save
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  )
}
