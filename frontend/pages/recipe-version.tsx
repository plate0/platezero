import React from 'react'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import {
  Layout,
  RecipeNav,
  RecipeVersion as RecipeVersionView,
  RecipeVersionHeader
} from '../components'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getRecipeVersion } from '../common/http'

interface RecipeVersionProps {
  token: string
  recipeVersion: RecipeVersionJSON
}

export default class RecipeVersion extends React.Component<RecipeVersionProps> {
  static async getInitialProps(ctx) {
    const { query } = ctx
    const { token } = nextCookie(ctx)
    return {
      token,
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
        <RecipeNav recipe={v.recipe} token={this.props.token} />
        <RecipeVersionHeader recipeVersion={v} />
        <RecipeVersionView recipeVersion={v} />
      </Layout>
    )
  }
}
