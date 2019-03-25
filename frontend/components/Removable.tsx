import React from 'react'
import { Row, Col, Button } from 'reactstrap'

export function Removable(props: { onRemove?: () => void; children: any }) {
  return (
    <Row>
      <Col xs="auto" className="pr-0">
        <Button color="link" onClick={props.onRemove}>
          <i className="fal fa-times text-secondary" />
        </Button>
      </Col>
      <Col className="align-self-center">{props.children}</Col>
    </Row>
  )
}
