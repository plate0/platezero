import React, { useState } from 'react'
import { Input, Row, Col, Button, Card, CardBody } from 'reactstrap'
import { ProfileQuestionJSON } from '../../models'
import { Help } from './Help'
import * as Templates from './templates'

export interface QuestionProps {
  question: ProfileQuestionJSON
  onAnswer: (answer: ProfileQuestionJSON) => void
}

export const Question = ({ question, onAnswer }: QuestionProps) => {
  const Component = Templates[question.type]
  if (Component) {
    return <Component question={question} onAnswer={onAnswer} />
  }
  const [answer, setAnswer] = useState(question.answer || '')

  const onSubmit = (e: React.FormEvent<EventTarget>) => {
    event.preventDefault()
    onAnswer({
      ...question,
      answer
    })
  }

  return (
    <Card body>
      <h3 className="mb-3 font-weight-light">{question.question}</h3>
      <form onSubmit={onSubmit}>
        <Input
          autoFocus={true}
          className="mb-3"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        <Help text={question.help_text} />
        <Row className="justify-content-end border-top mt-5">
          <Col xs="auto" className="p-3">
            <Button color="primary" value="submit" disabled={!answer}>
              Save
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  )
}
