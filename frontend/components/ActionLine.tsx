import React from 'react'
import { Row, Col, Button } from 'reactstrap'

export function ActionLine(props: {
  icon: string
  onAction?: () => void
  children?: any
}) {
  return (
    <Row>
      <Col xs="auto" className="pr-0">
        <Button color="link" onClick={props.onAction}>
          <i className={props.icon + ' text-secondary'} />
        </Button>
      </Col>
      <Col className="align-self-center">{props.children}</Col>
    </Row>
  )
}
