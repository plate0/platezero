import React from 'react'
import { Layout, RecipeNav } from '../components'
import Head from 'next/head'
import { Recipe as RecipeModel } from '../models/recipe'
import { getRecipe } from '../common/http'

interface RecipeProps {
  recipe: RecipeModel
}

export default class Recipe extends React.Component<RecipeProps> {
  static async getInitialProps({ query }) {
    return { recipe: await getRecipe(query.username, query.slug) }
  }

  public render() {
    const { recipe } = this.props
    return (
      <Layout>
        <Head>
          <title>{recipe.title}</title>
        </Head>
        <RecipeNav recipe={recipe} />
      </Layout>
    )
  }
}
