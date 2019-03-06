import React from 'react'
import { Row, Col } from 'reactstrap'
import { IfLoggedIn } from './IfLoggedIn'
const {
  routes: { Link }
} = require('../routes')

export interface ProfileNavProps {
  username: string
}

export const ProfileNav = (props: ProfileNavProps) => (
  <Row className="d-flex justify-content-between py-3 border-bottom align-items-center">
    <Col xs="2">
      <Link route={`/${props.username}/recipes`}>
        <a>Recipes</a>
      </Link>
    </Col>
    <IfLoggedIn username={props.username}>
      <Col xs="2">
        <Link route={`/${props.username}/recipe/new`}>
          <a className="btn btn-primary">New Recipe</a>
        </Link>
      </Col>
    </IfLoggedIn>
  </Row>
)
