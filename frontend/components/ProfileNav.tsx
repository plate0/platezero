import React from 'react'
import { Row, Col } from 'reactstrap'
import { IfLoggedIn } from './IfLoggedIn'
import { Link } from '../routes'

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
      <Col xs="4">
        <Row>
          <Col xs="6">
            <Link route="/recipes/new">
              <a className="btn btn-primary">New Recipe</a>
            </Link>
          </Col>
          <Col xs="6">
            <Link route="/recipes/import">
              <a className="btn btn-primary">Import Recipes</a>
            </Link>
          </Col>
        </Row>
      </Col>
    </IfLoggedIn>
  </Row>
)
