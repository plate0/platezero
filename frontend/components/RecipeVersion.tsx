import React from 'react'
import * as moment from 'moment'
import * as ReactMarkdown from 'react-markdown'
import { Row, Col, Badge } from 'reactstrap'
import { Amount } from './Amount'
import { StatBar } from './StatBar'
import { RecipeVersionJSON } from '../models/recipe_version'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { ProcedureListJSON } from '../models/procedure_list'
import { get } from 'lodash'

const getStats = (v: RecipeVersionJSON) => {
  const stats = []
  const duration = get(v.recipeDuration, 'duration_seconds')
  if (duration) {
    stats.push({
      name: 'Time',
      icon: 'clock',
      value: `${moment.duration(duration, 'seconds').asMinutes()} min`
    })
  }
  const y = get(v.recipeYield, 'text')
  if (y) {
    stats.push({ name: 'Servings', icon: 'utensils', value: y })
  }
  return stats
}

const RecipeHeader = (props: { recipeVersion: RecipeVersionJSON }) => (
  <Row>
    <Col xs="12" lg="8" className="py-2">
      <StatBar stats={getStats(props.recipeVersion)} />
      {get(props.recipeVersion, 'recipe.description') && (
        <p className="my-2 lead">
          {get(props.recipeVersion, 'recipe.description')}
        </p>
      )}
    </Col>
    <Col xs="12" lg="4" className="px-0 px-md-3">
      <img
        src={get(props.recipeVersion, 'recipe.image_url')}
        className="w-100"
      />
    </Col>
  </Row>
)

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => (
  <div className="mb-3">
    {list.name && <div className="lead">{list.name}</div>}
    {list.lines.map((l, key) => (
      <div key={key}>
        {l.image_url && <img className="w-100" src={l.image_url} />}
        {l.title && (
          <div>
            <h3
              style={{ fontSize: 16 }}
              className="border-bottom font-weight-bold py-2"
            >
              <Badge color="primary" pill className="mr-2">
                {key + 1}
              </Badge>
              {l.title}
            </h3>
          </div>
        )}
        <ReactMarkdown source={l.text} />
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
    {list.name && <div className="lead">{list.name}</div>}
    <ul className="list-unstyled">
      {list.lines.map((line, key) => (
        <IngredientListLine key={key} line={line} />
      ))}
    </ul>
  </>
)

export const RecipeVersion = (props: { recipeVersion: RecipeVersionJSON }) => {
  const v = props.recipeVersion
  return (
    <>
      <RecipeHeader recipeVersion={v} />
      <Row>
        <Col xs="12" md="6" lg="4">
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
