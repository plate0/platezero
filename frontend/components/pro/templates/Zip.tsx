import React, { useState } from 'react'
import { FormGroup, Label, Card, Row, Col, Input, Button } from 'reactstrap'
import { range } from 'lodash'
import { Help } from '../Help'

const help = `This allows us to check if you are in our serviced areas. If you are not, we'll let you know right now and email you when we are servicing that area.`

export const Zip = ({ question, onAnswer }) => {
  const [zip, setZip] = useState(question.answer || '')

  const onSubmit = (e: React.FormEvent<EventTarget>) => {
    event.preventDefault()
    onAnswer({
      ...question,
      answer: zip
    })
  }

  return (
    <Card body>
      <h3 className="font-weight-light">What is your zip code?</h3>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Input
            type="text"
            name="zip"
            id="zip"
            placeholder="Zip Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
          />
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
