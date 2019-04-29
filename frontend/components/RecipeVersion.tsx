import React from 'react'
import * as _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { RecipeVersionHeader } from './RecipeVersionVitals'
import { RecipeVersionJSON } from '../models/recipe_version'
import { RecipeNav } from './RecipeNav'
import { Preheats } from './Preheats'

export const RecipeVersion = ({ version }: { version: RecipeVersionJSON }) => {
  return (
    <>
      <Row className="position-relative">
        <RecipeVersionHeader version={version} />
      </Row>
      <Row>
        <Col xs="12" className="px-0 px-sm-3">
          <RecipeNav recipe={version.recipe} route={''} />
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

  /*
  return (
    <>
      <details className="mb-3">
        <summary>
          Authored by{' '}
          <a href={`/${v.author.username}`} itemProp="author">
            {getName(v.author)}
          </a>{' '}
          <Timestamp itemProp="dateModified" t={moment(v.created_at)} />{' '}
        </summary>
        <div className="bg-light p-3">
          <Markdown source={v.message} />
          <div className="small text-muted pt-1 border-top">
            {humanize(moment(v.created_at))}
            {prevUrl && (
              <a href={prevUrl} className="ml-2">
                Previous Version
              </a>
            )}
          </div>
        </div>
      </details>
      <RecipeVersionVitals recipeVersion={v} />
      <Row>
        <Col xs="12" md="6" lg="4">
          <EditableImage
            src={imageUrl}
            onUpdate={onRecipeImageEdit}
            canEdit={
              v.recipe.owner.username === _.get(userContext, 'user.username')
            }
          >
            <img
              className="w-100"
              src={imageUrl}
              itemProp="image"
              alt={`Picture of ${v.recipe.title}`}
            />
          </EditableImage>
          <AlertErrors errors={updateImageErrors} />
          <h2>Ingredients</h2>
          <IngredientLists lists={v.ingredientLists} />
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2>Instructions</h2>
          <ProcedureLists lists={v.procedureLists} />
        </Col>
      </Row>
    </>
  )
  */
}
