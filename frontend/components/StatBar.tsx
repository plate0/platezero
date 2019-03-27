import React from 'react'
import { Row, Col } from 'reactstrap'

interface StatProps {
  name: string
  icon: string
  value: string
}

const Stat = (props: StatProps) => (
  <Col className="my-2 text-center">
    <i className={`fal fa-${props.icon} fa-2x`} />
    <div className="text-uppercase">{props.name}</div>
    <div>{props.value}</div>
  </Col>
)

export const StatBar = (props: { stats: StatProps[] }) => {
  if (!props.stats.length) {
    return null
  }
  return (
    <Row className="border-top border-bottom align-items-center">
      {props.stats.map((stat, key) => (
        <Stat key={key} {...stat} />
      ))}
    </Row>
  )
}
