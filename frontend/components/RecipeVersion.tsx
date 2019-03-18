import React from 'react'
import * as moment from 'moment'
import * as ReactMarkdown from 'react-markdown'
import { Row, Col } from 'reactstrap'
import { Amount } from './Amount'
import { RecipeVersionJSON } from '../models/recipe_version'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
import { ProcedureListJSON } from '../models/procedure_list'
import { get } from 'lodash'

interface RecipeHeaderProps {
  title: string
  subtitle?: string
  description?: string
  duration?: number | string
  yield?: string
  imageUrl?: string
  source?: string
}

const RecipeHeader = (props: RecipeHeaderProps) => {
  const source = props.source && (
    <Col xs="auto">
      <a target="_blank" href={props.source}>
        <i className="fal fa-external-link" />
      </a>
    </Col>
  )
  const subtitle = props.subtitle && (
    <h2 className="mb-3 text-muted">{props.subtitle}</h2>
  )
  const details = (props.duration || props.yield) && (
    <Row className="border-top border-bottom align-items-center">
      {props.duration && (
        <Col xs="6" className="my-2 text-center">
          <i className="fal fa-clock fa-2x" />
          <div className="text-uppercase">Time</div>
          <div>
            {moment.duration(props.duration, 'seconds').asMinutes()} min
          </div>
        </Col>
      )}
      {props.yield && (
        <Col xs="6" className="my-2 text-center">
          <i className="fal fa-utensils fa-2x" />
          <div className="text-uppercase">Servings</div>
          <div>{props.yield}</div>
        </Col>
      )}
    </Row>
  )
  const description = props.description && (
    <p className="my-2">{props.description}</p>
  )
  return (
    <Row>
      <Col xs="6">
        <Row className="align-items-center justify-content-between">
          <Col xs="11">
            <h1 className="mb-1">{props.title}</h1>
          </Col>
          {source}
        </Row>
        {subtitle}
        {details}
        {description}
      </Col>
      <Col xs="6">
        <img src={props.imageUrl} className="w-100" />
      </Col>
      <style jsx>
        {`
          h1 {
            font-size: 30px;
          }
          h2 {
            font-size: 16px;
          }
        `}
      </style>
    </Row>
  )
}

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => {
  const name = list.name || 'Instructions'
  return (
    <div className="mb-3">
      <div>
        <strong>{name}</strong>
      </div>
      <Row>
        {list.lines.map((l, key) => (
          <Col xs="6" key={key}>
            {l.image_url && <img className="w-100" src={l.image_url} />}
            {l.title && <h3 className="border-bottom">{l.title}</h3>}
            <ReactMarkdown source={l.text} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

const IngredientListLine = ({ line }: { line: IngredientLineJSON }) => {
  return (
    <div>
      <Amount
        numerator={line.quantity_numerator}
        denominator={line.quantity_denominator}
      />{' '}
      {line.unit} {line.name}
      {line.preparation && ', ' + line.preparation}
      {line.optional && (
        <span className="badge badge-secondary ml-1">Optional</span>
      )}
    </div>
  )
}

const IngredientList = ({ list }: { list: IngredientListJSON }) => {
  const title = (
    <div>
      <strong>{list.name || 'Ingredients'}</strong>
    </div>
  )
  const image = list.image_url && (
    <Col xs="8">
      <img className="w-100" src={list.image_url} />
    </Col>
  )
  return (
    <Row className="mb-3">
      {image}
      <Col xs={image ? '4' : '12'}>
        {title}
        {list.lines.map((line, key) => (
          <IngredientListLine key={key} line={line} />
        ))}
      </Col>
    </Row>
  )
}

export const RecipeVersion = (props: { recipeVersion: RecipeVersionJSON }) => {
  const v = props.recipeVersion
  return (
    <Row>
      <Col xs="12">
        <RecipeHeader
          title={v.recipe.title}
          subtitle={get(v.recipe, 'subtitle')}
          description={get(v.recipe, 'description')}
          duration={get(v.recipeDuration, 'duration_seconds')}
          yield={get(v.recipeYield, 'text')}
          imageUrl={get(v.recipe, 'image_url')}
          source={get(v.recipe, 'source_url')}
        />
      </Col>
      <Col xs={12}>
        <h5>Ingredients</h5>
        {v.ingredientLists.map((il, key) => (
          <IngredientList key={key} list={il} />
        ))}
      </Col>
      <Col xs={12}>
        <h5>Procedure</h5>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList key={key} list={pl} />
        ))}
      </Col>
    </Row>
  )
}
