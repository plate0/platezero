import React from 'react'
import { Layout } from '../components'
import Head from 'next/head'
import { RecipeJSON, UserJSON } from '../models'
import { RecipeList } from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user: UserJSON
  recipes: RecipeJSON[]
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query }) {
    const { username } = query
    return {
      user: await api.getUser(username),
      recipes: await api.getUserRecipes(username)
    }
  }

  public render() {
    const { user, recipes } = this.props
    return (
      <Layout>
        <Head>
          <title>{getName(user)} - Recipes</title>
        </Head>
        <RecipeList recipes={recipes} user={user} />
      </Layout>
    )
  }
}
