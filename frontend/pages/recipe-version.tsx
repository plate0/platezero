import React from 'react'
import * as moment from 'moment'
import Head from 'next/head'
import { get } from 'lodash'
import { Row, Col } from 'reactstrap'
import { Layout, RecipeNav, Amount } from '../components'
import { RecipeVersion as RecipeVersionModel } from '../models/recipe_version'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientList as IngredientListModel } from '../models/ingredient_list'
import { ProcedureList as ProcedureListModel } from '../models/procedure_list'
import { getRecipeVersion } from '../common/http'
import * as ReactMarkdown from 'react-markdown'

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
          <Col xs="auto">
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

interface ProcedureListProps {
  list: ProcedureListModel
}

const ProcedureList = ({ list }: ProcedureListProps) => {
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

interface IngredientListLineProps {
  line: IngredientLineJSON
}

const IngredientListLine = (props: IngredientListLineProps) => {
  const l = props.line
  return (
    <div>
      <Amount
        numerator={l.quantity_numerator}
        denominator={l.quantity_denominator}
      />{' '}
      {l.unit} {l.name}
      {l.preparation ? ', ' + l.preparation : undefined}
      {l.optional ? (
        <span className="badge badge-secondary ml-1">Optional</span>
      ) : (
        undefined
      )}
    </div>
  )
}

interface IngredientListProps {
  list: IngredientListModel
}

const IngredientList = ({ list }: IngredientListProps) => {
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

interface RecipeVersionProps {
  recipeVersion: RecipeVersionModel
}

export default class RecipeVersion extends React.Component<RecipeVersionProps> {
  static async getInitialProps({ query }) {
    return {
      recipeVersion: await getRecipeVersion(
        query.username,
        query.slug,
        parseInt(query.versionId, 10)
      )
    }
  }

  public render() {
    const v = this.props.recipeVersion
    return (
      <Layout>
        <Head>
          <title>{v.recipe.title}</title>
        </Head>
        <RecipeNav recipe={v.recipe} selectedRecipeVersion={v.id} />
        <RecipeHeader
          title={v.recipe.title}
          subtitle={get(v.recipe, 'subtitle')}
          description={get(v.recipe, 'description')}
          duration={get(v.recipeDuration, 'duration_seconds')}
          yield={get(v.recipeYield, 'text')}
          imageUrl={get(v.recipe, 'image_url')}
          source={get(v.recipe, 'source_url')}
        />
        <Row>
          <Col xs="12">
            {v.ingredientLists.map((il, key) => (
              <IngredientList key={key} list={il} />
            ))}
          </Col>
        </Row>
        <div className="w-100" style={{ pageBreakBefore: 'always' }} />
        <Row>
          <Col xs="12">
            {v.procedureLists.map((pl, key) => (
              <ProcedureList key={key} list={pl} />
            ))}
          </Col>
        </Row>
      </Layout>
    )
  }
}
