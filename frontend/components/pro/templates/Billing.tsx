import React, { useState } from 'react'
import { Card, Row, Col, Button } from 'reactstrap'
import { Elements } from 'react-stripe-elements'
import { PaymentForm } from '../PaymentForm'
import { Help } from '../Help'

const help = ''

export const Billing = ({ question, onAnswer }) => {
  const oldCard = question.answer ? JSON.parse(question.answer) : undefined
  const [card, setCard] = useState(null)

  const onSubmit = (e: React.FormEvent<EventTarget>) => {
    event.preventDefault()
    onAnswer({
      ...question,
      answer: `${adults},${children}`
    })
  }

  const onSuccess = res =>
    onAnswer({
      ...question,
      answer: JSON.stringify(res.token.card)
    })

  const onError = err => alert(err.message)

  return (
    <Card body>
      <h3 className="font-weight-light">Billing Information</h3>
      <p>
        Your card will be charged the monthly cost when we send your first meal
        plan. It will also be charged the cost of groceries. You can update the
        card later in your profile.
      </p>
      <Elements>
        <PaymentForm
          buttonText="Add Payment Info"
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
      <Help text={help} />
    </Card>
  )
}
