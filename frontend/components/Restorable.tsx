import React from 'react'
import { Row, Col, Button } from 'reactstrap'

export function Restorable(props: { onRestore?: () => void; children: any }) {
  return (
    <Row>
      <Col xs="auto" className="pr-0">
        <Button color="link" onClick={props.onRestore}>
          <i className="fal fa-undo text-secondary" />
        </Button>
      </Col>
      <Col className="align-self-center">{props.children}</Col>
    </Row>
  )
}
