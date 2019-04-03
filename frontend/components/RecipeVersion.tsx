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

const formatDuration = (seconds: number) => {
  const dur = moment.duration(seconds, 'seconds')
  const [h, m] = [dur.hours(), dur.minutes()]
  const hs = `${h}h`
  const ms = `${m}m`
  if (h > 0) {
    return m !== 0 ? `${hs} ${ms}` : hs
  }
  return ms
}

const getStats = (v: RecipeVersionJSON) => {
  const stats = []
  const duration = get(v.recipeDuration, 'duration_seconds')
  if (duration) {
    stats.push({
      name: 'Time',
      icon: 'clock',
      value: formatDuration(duration)
    })
  }
  const y = get(v.recipeYield, 'text')
  if (y) {
    stats.push({ name: 'Yield', icon: 'utensils', value: y })
  }
  return stats
}

const RecipeHeader = ({
  recipeVersion
}: {
  recipeVersion: RecipeVersionJSON
}) => {
  const stats = getStats(recipeVersion)
  const description = get(recipeVersion, 'recipe.description')
  const imageUrl = get(recipeVersion, 'recipe.image_url')
  if (!stats.length && !description && !imageUrl) {
    return null
  }
  return (
    <Row>
      <Col xs="12" lg="8" className="d-flex flex-column">
        <StatBar stats={stats} />
        {description && <p className="lead my-auto">{description}</p>}
      </Col>
      <Col xs="12" lg="4">
        <img
          src={imageUrl}
          className="w-100"
          alt={`Picture of ${recipeVersion.recipe.title}`}
        />
      </Col>
    </Row>
  )
}

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
