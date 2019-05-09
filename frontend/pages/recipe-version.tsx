import React from 'react'
import { Alert, Row, Col } from 'reactstrap'
import Head from 'next/head'
import ErrorPage from './_error'
import { Layout, RecipeVersion as RecipeVersionView } from '../components'
import { RecipeJSON, RecipeVersionJSON } from '../models'
import { api } from '../common/http'

interface RecipeVersionProps {
  recipe?: RecipeJSON
  recipeVersion?: RecipeVersionJSON
  statusCode?: number
}

export default class RecipeVersion extends React.Component<RecipeVersionProps> {
  static async getInitialProps({ query, res }) {
    try {
      return {
        recipe: await api.getRecipe(query.username, query.slug),
        recipeVersion: await api.getRecipeVersion(
          query.username,
          query.slug,
          parseInt(query.versionId, 10)
        )
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    if (this.props.statusCode) {
      return <ErrorPage statusCode={this.props.statusCode} />
    }
    const { recipe, recipeVersion } = this.props
    return (
      <Layout>
        <Head>
          <title>{recipe.title}</title>
        </Head>
        <div itemScope={true} itemType="http://schema.org/Recipe">
          <Row className="mt-3">
            <Col xs="12">
              <Alert
                color="warning"
                className="d-print-none d-flex justify-content-between align-items-center"
              >
                <span>Viewing an older version of this recipe.</span>
                <a
                  className="btn btn-outline-primary"
                  href={`/${recipe.owner.username}/${recipe.slug}`}
                >
                  Show Current Version
                </a>
              </Alert>
            </Col>
          </Row>
          <RecipeVersionView
            version={recipeVersion}
            recipe={recipe}
            pathname="/recipe"
          />
        </div>
      </Layout>
    )
  }
}
