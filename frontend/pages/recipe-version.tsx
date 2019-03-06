import React from 'react'
import Head from 'next/head'
import { Row, Col } from 'reactstrap'
import { Layout, RecipeNav, Timestamp, Amount } from '../components'
import { RecipeVersion as RecipeVersionModel } from '../models/recipe_version'
import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientList as IngredientListModel } from '../models/ingredient_list'
import { ProcedureList as ProcedureListModel } from '../models/procedure_list'
import { getRecipeVersion } from '../common/http'
const {
  routes: { Link }
} = require('../routes')

interface ProcedureListProps {
  procedureList: ProcedureListModel
}

const ProcedureList = (props: ProcedureListProps) => {
  const pl = props.procedureList
  return (
    <div className="mb-3">
      {pl.name ? (
        <div>
          <strong>{pl.name}</strong>
        </div>
      ) : (
        undefined
      )}
      {pl.lines.map((l, key) => (
        <p key={key}>{l.text}</p>
      ))}
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
  ingredientList: IngredientListModel
}

const IngredientList = (props: IngredientListProps) => {
  const title = props.ingredientList.name ? (
    <div>
      <strong>{props.ingredientList.name}</strong>
    </div>
  ) : (
    undefined
  )
  return (
    <div className="mb-3">
      {title}
      {props.ingredientList.lines.map((line, key) => (
        <IngredientListLine key={key} line={line} />
      ))}
    </div>
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
        <Row>
          <Col>
            <pre className="bg-light p-1">{v.message}</pre>
          </Col>
          <Col xs="auto text-muted">
            by{' '}
            <Link route={`/${v.author.username}`}>
              <a>{v.author.username}</a>
            </Link>{' '}
            <Timestamp t={v.created_at} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={4}>
            <h5>Ingredients</h5>
            {v.ingredientLists.map((il, key) => (
              <IngredientList key={key} ingredientList={il} />
            ))}
          </Col>
          <Col xs={12} lg={8}>
            <h5>Procedure</h5>
            {v.procedureLists.map((pl, key) => (
              <ProcedureList key={key} procedureList={pl} />
            ))}
          </Col>
        </Row>
      </Layout>
    )
  }
}
