import React from 'react'
import { Row, Col } from 'reactstrap'
const {
  routes: { Link }
} = require('../routes')

export interface ProfileNavProps {
  username: string
}

export const ProfileNav = (props: ProfileNavProps) => (
  <Row className="d-flex justify-content-around py-3 border-bottom">
    <Col xs="2">
      <Link route={`/${props.username}/recipes`}>
        <a>Recipes</a>
      </Link>
    </Col>
    <Col xs="2">
      <Link route={`/${props.username}/tares`}>
        <a>Tares</a>
      </Link>
    </Col>
  </Row>
)
