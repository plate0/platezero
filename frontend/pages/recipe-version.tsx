import React from 'react'
import { Row, Col } from 'reactstrap'
import Head from 'next/head'
import {
  Layout,
  RecipeVersion as RecipeVersionView,
  RecipeTitle
} from '../components'
import { RecipeVersionJSON } from '../models/recipe_version'
import { api } from '../common/http'

interface RecipeVersionProps {
  recipeVersion: RecipeVersionJSON
}

export default class RecipeVersion extends React.Component<RecipeVersionProps> {
  static async getInitialProps({ query }) {
    return {
      recipeVersion: await api.getRecipeVersion(
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
        <div itemScope={true} itemType="http://schema.org/Recipe">
          <Row className="mt-3">
            <Col>
              <RecipeTitle recipe={v.recipe} />
            </Col>
            <Col xs="auto">
              <a
                className="btn btn-outline-primary"
                href={`/${v.recipe.owner.username}/${v.recipe.slug}`}
              >
                Show Current Version
              </a>
            </Col>
          </Row>
          <RecipeVersionView recipeVersion={v} />
        </div>
      </Layout>
    )
  }
}
