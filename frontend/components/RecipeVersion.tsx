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

const StepNumber = ({ i }: { i: number }) => (
  <span
    style={{
      backgroundColor: '#18afcf',
      color: '#ffffff',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '12px',
      padding: '7px 9px',
      borderRadius: '30px',
      float: 'left',
      marginTop: '4px',
      marginRight: '5px'
    }}
  >
    {i}
  </span>
)

const RecipeHeader = (props: RecipeHeaderProps) => {
  const source = props.source && (
    <Col xs="auto">
      <a target="_blank" href={props.source}>
        View Original <i className="fal fa-external-link" />
      </a>
    </Col>
  )
  const subtitle = props.subtitle && (
    <h2 style={{ fontSize: 16 }} className="mb-3 text-muted">
      {props.subtitle}
    </h2>
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
      <Col
        xs={{ order: 2, size: 12 }}
        md={{ order: 1, size: 6 }}
        className="py-2"
      >
        <Row className="align-items-center justify-content-between">
          <Col xs="12">
            <h1 className="mb-1">{props.title}</h1>
            {subtitle}
          </Col>
          {source}
        </Row>
        {details}
        {description}
      </Col>
      <Col
        xs={{ order: 1, size: 12 }}
        md={{ order: 2, size: 6 }}
        className="px-0 px-md-3"
      >
        <img src={props.imageUrl} className="w-100" />
      </Col>
      <style jsx>
        {`
          h1 {
            font-size: 30px;
          }
        `}
      </style>
    </Row>
  )
}

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => {
  const name = list.name && <div className="lead">{list.name}</div>
  return (
    <div className="mb-3">
      {name}
      <Row>
        {list.lines.map((l, key) => (
          <Col xs="12" md="6" key={key}>
            {l.image_url && <img className="w-100" src={l.image_url} />}
            {l.title && (
              <div>
                <StepNumber i={key} />
                <h3
                  style={{ fontSize: 16 }}
                  className="border-bottom font-weight-bold py-2"
                >
                  {l.title}
                </h3>
              </div>
            )}
            <ReactMarkdown source={l.text} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

const IngredientListLine = ({ line }: { line: IngredientLineJSON }) => {
  return (
    <li
      style={{ fontSize: 16, lineHeight: '38px' }}
      className="d-flex align-items-center"
    >
      <span className="text-muted text-right mr-2" style={{ width: '80px' }}>
        <Amount
          numerator={line.quantity_numerator}
          denominator={line.quantity_denominator}
        />{' '}
        {line.unit}
      </span>
      <strong>{line.name}</strong>
      {line.preparation && ', ' + line.preparation}
      {line.optional && <span className="badge badge-info ml-1">Optional</span>}
    </li>
  )
}

const IngredientList = ({ list }: { list: IngredientListJSON }) => {
  const title = list.name && <div className="lead">{list.name}</div>
  const image = list.image_url && (
    <Col xs="12" md="8">
      <img className="w-100" src={list.image_url} />
    </Col>
  )
  return (
    <Row className="mb-3">
      {image}
      <Col xs="12" md={image ? '4' : '12'}>
        {title}
        <ul className="list-unstyled">
          {list.lines.map((line, key) => (
            <IngredientListLine key={key} line={line} />
          ))}
        </ul>
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
      <Col xs={12} className="mt-5">
        <h2>Ingredients</h2>
        {v.ingredientLists.map((il, key) => (
          <IngredientList key={key} list={il} />
        ))}
      </Col>
      <Col xs={12} className="mt-5">
        <h2>Instructions</h2>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList key={key} list={pl} />
        ))}
      </Col>
    </Row>
  )
}
