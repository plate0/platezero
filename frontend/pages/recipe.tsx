import React from 'react'
import * as _ from 'lodash'
import {
  Layout,
  RecipeNav,
  RecipeVersion as RecipeVersionView
} from '../components'
import Head from 'next/head'
import {
  Recipe as RecipeModel,
  RecipeVersion as RecipeVersionModel
} from '../models/recipe'
import { getRecipe, getRecipeVersion } from '../common/http'

interface RecipeProps {
  recipe: RecipeModel
  recipeVersion?: RecipeVersionModel
}

export default class Recipe extends React.Component<RecipeProps> {
  static async getInitialProps({ query }) {
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { recipe, recipeVersion }
  }

  public render() {
    const { recipe, recipeVersion } = this.props
    return (
      <Layout>
        <Head>
          <title>{recipe.title}</title>
        </Head>
        <RecipeNav recipe={recipe} />
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
      </Layout>
    )
  }
}
