import React from 'react'
import * as moment from 'moment'
import { Row, Col } from 'reactstrap'
import { Timestamp, humanize } from './Timestamp'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { RecipeVersionVitals } from './RecipeVersionVitals'
import { Markdown } from './Markdown'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getName } from '../common/model-helpers'

export const RecipeVersion = (props: { recipeVersion: RecipeVersionJSON }) => {
  const v = props.recipeVersion
  const prevUrl = v.parent_recipe_version_id
    ? `/${v.recipe.owner.username}/${v.recipe.slug}/versions/${
        v.parent_recipe_version_id
      }`
    : undefined
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
          {v.recipe.image_url && (
            <img
              className="w-100 mb-3"
              src={v.recipe.image_url}
              alt={`Picture of ${v.recipe.title}`}
              itemProp="image"
            />
          )}
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
}
