import React from 'react'
import { Row, Col } from 'reactstrap'
import { Timestamp } from './Timestamp'
import { UserCard } from './UserCard'
import { RecipeVersion as RecipeVersionModel } from '../models/recipe_version'

export const RecipeVersionHeader = (props: {
  recipeVersion: RecipeVersionModel
}) => {
  const v = props.recipeVersion
  return (
    <Row className="align-items-center my-3">
      <Col xs="auto" className="py-1">
        <UserCard user={v.author} />
        <div className="text-muted">
          <Timestamp t={v.created_at} />
        </div>
      </Col>
      <Col className="align-self-stretch">
        <pre className="bg-light p-1 h-100">{v.message}</pre>
      </Col>
    </Row>
  )
}
