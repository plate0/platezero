import React from 'react'
import { Layout } from '../components'
import Head from 'next/head'
import { Row, Col } from 'reactstrap'
import { Recipe as RecipeModel } from '../models/recipe'
import { getRecipe } from '../common/http'
const {
  routes: { Link }
} = require('../routes')

interface RecipeProps {
  recipe: RecipeModel
}

export default class Recipe extends React.Component<RecipeProps> {
  static async getInitialProps({ query }) {
    return { recipe: await getRecipe(query.username, query.slug) }
  }

  public render() {
    const { recipe } = this.props
    const { owner } = recipe
    return (
      <Layout>
        <Head>
          <title>{recipe.title}</title>
        </Head>
        <h1>
          <Link route={`/${owner.username}/recipes`}>{owner.username}</Link> /{' '}
          <a>{recipe.title}</a>
        </h1>
        <Row>
          {recipe.branches.map(b => (
            <Col key={b.recipeVersion.id}>
              <Link route={`/${owner.username}/${recipe.slug}/versions/${b.recipeVersion.id}`}>
                <a>{b.name}</a>
              </Link>
            </Col>
          ))}
        </Row>
        {this.props.children}
      </Layout>
    )
  }
}
