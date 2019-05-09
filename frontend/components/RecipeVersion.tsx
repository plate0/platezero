import React from 'react'
import * as _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { RecipeVersionHeader } from './RecipeVersionVitals'
import { RecipeJSON, RecipeVersionJSON } from '../models'
import { RecipeNav } from './RecipeNav'
import { Preheats } from './Preheats'

export const RecipeVersion = ({
  version,
  recipe,
  pathname
}: {
  version: RecipeVersionJSON
  recipe: RecipeJSON
  pathname: string
}) => {
  return (
    <>
      <Row className="position-relative">
        <RecipeVersionHeader version={version} recipe={recipe} />
      </Row>
      <Row>
        <Col xs="12" className="px-0 px-sm-3">
          <RecipeNav recipe={recipe} route={pathname} />
        </Col>
      </Row>
      {recipe.description && (
        <Row className="mt-3">
          <Col>
            <p style={{ lineHeight: '2rem' }}>{recipe.description}</p>
          </Col>
        </Row>
      )}
      <Row className="mt-3">
        <Col xs="12" md="6" lg="4">
          <h2 className="border-bottom">Ingredients</h2>
          <IngredientLists lists={version.ingredientLists} />
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2 className="border-bottom">Instructions</h2>
          <Preheats preheats={version.preheats} />
          <ProcedureLists lists={version.procedureLists} />
        </Col>
      </Row>
    </>
  )
}
