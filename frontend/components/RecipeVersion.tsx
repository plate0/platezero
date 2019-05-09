import React from 'react'
import * as _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { RecipeVersionHeader } from './RecipeVersionVitals'
import { RecipeVersionJSON } from '../models/recipe_version'
import { RecipeNav } from './RecipeNav'
import { Preheats } from './Preheats'
import { PrintButton } from './PrintButton'

export const RecipeVersion = ({
  version,
  pathname
}: {
  version: RecipeVersionJSON
  pathname: string
}) => {
  return (
    <>
      <Row className="position-relative">
        <RecipeVersionHeader version={version} recipe={version.recipe} />
      </Row>
      <Row>
        <Col xs="12" className="px-0 px-sm-3">
          <RecipeNav recipe={version.recipe} route={pathname} />
        </Col>
      </Row>
      {version.recipe.description && (
        <Row className="mt-3">
          <Col>
            <p style={{ lineHeight: '2rem' }}>{version.recipe.description}</p>
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
