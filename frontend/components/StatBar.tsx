import React from 'react'
import { Row, Col } from 'reactstrap'

interface Stat {
  name: string
  icon: string
  value: string
}

export const StatBar = (props: { stats: Stat[] }) => {
  if (!props.stats.length) {
    return null
  }
  return (
    <Row className="border-top border-bottom align-items-center">
      {props.stats.map((stat, key) => (
        <Col key={key} className="my-2 text-center">
          <i className={`fal fa-${stat.icon} fa-2x text-muted`} />
          <div className="text-uppercase small text-muted">{stat.name}</div>
          <div className="lead">{stat.value}</div>
        </Col>
      ))}
    </Row>
  )
}
