import React from 'react'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'

import { Layout, RecipeNav } from '../components'
import { getRecipeVersion } from '../common/http'
import { RecipeVersion as RecipeVersionModel } from '../models'

interface EditRecipeProps {
  token: string
  recipeVersion: RecipeVersionModel
}

export default class EditRecipe extends React.Component<EditRecipeProps> {
  constructor(props: EditRecipeProps) {
    super(props)
  }

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
          <title>Edit {v.recipe.title} on PlateZero</title>
        </Head>
        <RecipeNav recipe={v.recipe} />
        <pre>
          {JSON.stringify(
            _.omit(v, ['recipe', 'author', 'id', 'created_at', 'message']),
            null,
            2
          )}
        </pre>
      </Layout>
    )
  }
}
