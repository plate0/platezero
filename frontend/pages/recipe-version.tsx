import React from 'react'
import Head from 'next/head'
import {
  Layout,
  RecipeNav,
  RecipeVersion as RecipeVersionView,
  RecipeVersionHeader
} from '../components'
import { RecipeVersion as RecipeVersionModel } from '../models/recipe_version'
import { getRecipeVersion } from '../common/http'

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
        <RecipeVersionHeader recipeVersion={v} />
        <RecipeVersionView recipeVersion={v} />
      </Layout>
    )
  }
}
