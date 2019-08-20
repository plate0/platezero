import React, { useState } from 'react'
import { range } from 'lodash'

export const CreditCard = ({ question, onAnswer }) => {
  const [zip, setZip] = useState(question.answer || '')

  const onChange = (e: any) => {
    setAnswer(e.target.value)
    onAnswer({
      ...question,
      answer: e.target.value
    })
  }

  return (
    <Card>
      <h3 className="font-weight-light">What is your zip code?</h3>
      <form onSubmit={onAnswer}>
        <input />
        <div>
          This allows us to check if you are in our serviced areas. If you are
          not, we'll let you know right now and email you when we are servicing
          that area.
        </div>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button color="primary" value="submit">
              Save & Continue
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  )
}
