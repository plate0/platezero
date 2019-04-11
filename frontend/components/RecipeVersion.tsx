import React from 'react'
import * as moment from 'moment'
import * as ReactMarkdown from 'react-markdown'
import { Row, Col, Badge } from 'reactstrap'
import { Amount } from './Amount'
import { Timestamp, humanize } from './Timestamp'
import { RecipeVersionVitals } from './RecipeVersionVitals'
import { RecipeVersionJSON } from '../models/recipe_version'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { ProcedureListJSON } from '../models/procedure_list'
import { getName } from '../common/model-helpers'

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => (
  <div className="mb-3">
    {list.name && <h3>{list.name}</h3>}
    {list.lines.map((l, key) => (
      <div key={key}>
        {l.title && (
          <div className="mb-3">
            <h4 className="border-bottom pb-2">
              <Badge color="primary" pill className="mr-2">
                {key + 1}
              </Badge>
              {l.title}
            </h4>
          </div>
        )}
        <Row>
          {l.image_url && (
            <Col xs="12" lg="4">
              <img className="w-100 mb-3" src={l.image_url} />
            </Col>
          )}
          <Col>
            <ReactMarkdown source={l.text} />
          </Col>
        </Row>
      </div>
    ))}
  </div>
)

const IngredientListLine = ({ line }: { line: IngredientLineJSON }) => (
  <li className="mb-2">
    <Amount
      numerator={line.quantity_numerator}
      denominator={line.quantity_denominator}
    />{' '}
    {line.unit} {line.name}
    {line.preparation && ', ' + line.preparation}
    {line.optional && <span className="badge badge-info ml-1">Optional</span>}
  </li>
)

const IngredientList = ({ list }: { list: IngredientListJSON }) => (
  <>
    {list.name && <h3>{list.name}</h3>}
    <ul className="list-unstyled">
      {list.lines.map((line, key) => (
        <IngredientListLine key={key} line={line} />
      ))}
    </ul>
  </>
)

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
          Authored by <a href={`/${v.author.username}`}>{getName(v.author)}</a>{' '}
          <Timestamp t={moment(v.created_at)} />{' '}
        </summary>
        <div className="bg-light p-3">
          <ReactMarkdown source={v.message} />
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
            />
          )}
          <h2>Ingredients</h2>
          {v.ingredientLists.map((il, key) => (
            <IngredientList key={key} list={il} />
          ))}
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2>Instructions</h2>
          {v.procedureLists.map((pl, key) => (
            <ProcedureList key={key} list={pl} />
          ))}
        </Col>
      </Row>
    </>
  )
}
