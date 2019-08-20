import React, { useState } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { ProfileQuestionJSON } from '../../models'
import { Question } from './Question'

export interface QuestionsProps {
  questions: ProfileQuestionJSON[]
  onAnswer: (answer: ProfileQuestionJSON) => void
  captive?: boolean
}

const Welcome = ({ x }) => (
  <>
    <h1 className="font-weight-light mt-4">Welcome,</h1>
    <p className="lead">
      Before you continue to your profile we need you to answer {x} quick
      questions.
    </p>
  </>
)

export const Questions = ({ captive, questions, onAnswer }: QuestionsProps) => {
  const [index, setIndex] = useState(0)
  const pages = [
    ...questions.map(q => <Question question={q} onAnswer={onAnswer} />)
  ]
  return (
    <>
      <Row className="mt-4">
        <Col sm="12" lg={{ size: 8, offset: 2 }}>
          {pages[index]}
        </Col>
      </Row>
    </>
  )
}
