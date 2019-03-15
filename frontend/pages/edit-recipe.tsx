import React from 'react'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'
import rfc6902 from 'rfc6902'

import { Layout, RecipeNav, ProcedureList, IngredientList } from '../components'
import { getRecipe, getRecipeVersion } from '../common/http'
import { RecipeVersion as RecipeVersionModel } from '../models'

interface Props {
  token: string
  branch: string
  recipeVersion: RecipeVersionModel
}

interface State {
  ingredientListPatch: rfc6902.Patch
}

export default class EditRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      ingredientListPatch: []
    }
  }

  static async getInitialProps(ctx): Promise<Props> {
    const { query } = ctx
    const { token } = nextCookie(ctx)
    const branch = query.branch
    const recipe = await getRecipe(query.username, query.slug, { token })
    const recipeVersionId = _.get(
      _.head(_.filter(recipe.branches, { name: branch })),
      'recipe_version_id'
    )
    return {
      token,
      branch,
      recipeVersion: await getRecipeVersion(
        query.username,
        query.slug,
        recipeVersionId
      )
    }
  }

  public render() {
    const v = this.props.recipeVersion
    return (
      <Layout>
        <Head>
          <title>Editing {v.recipe.title} on PlateZero</title>
        </Head>
        <RecipeNav recipe={v.recipe} />
        <h1>Ingredients</h1>
        {v.ingredientLists.map((il, key) => (
          <IngredientList
            key={key}
            ingredientList={il}
            onChange={(_, ingredientListPatch) => this.setState({ ingredientListPatch })}
          />
        ))}
        <h1>Instructions</h1>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList
            procedureList={pl}
            key={key}
          />
        ))}
      </Layout>
    )
  }
}
