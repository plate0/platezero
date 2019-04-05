import React from 'react'
import { Layout } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { RecipeJSON, UserJSON } from '../models'
import { RecipeList } from '../components'
import { getUser, getUserRecipes } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user: UserJSON
  recipes: RecipeJSON[]
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps(ctx) {
    const { username } = ctx.query
    const { token } = nextCookie(ctx)
    return {
      user: await getUser(username, { token }),
      recipes: await getUserRecipes(username, { token })
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
