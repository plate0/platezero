import React from 'react'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'

import { Layout, RecipeNav, ProcedureList } from '../components'
import { getRecipe, getRecipeVersion } from '../common/http'
import { RecipeVersion as RecipeVersionModel } from '../models'

interface EditRecipeProps {
  token: string
  branch: string
  recipeVersion: RecipeVersionModel
}

export default class EditRecipe extends React.Component<EditRecipeProps> {
  constructor(props: EditRecipeProps) {
    super(props)
  }

  static async getInitialProps(ctx) {
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
        <h1>Instructions</h1>
        <pre>{JSON.stringify(v.procedureLists)}</pre>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList
            procedureList={pl}
            key={key}
            onChange={e => console.log('new procedure list', e)}
          />
        ))}
      </Layout>
    )
  }
}
