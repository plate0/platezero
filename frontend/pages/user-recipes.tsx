import React from 'react'
import { Layout, ProfileHeader } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { RecipeJSON, UserJSON } from '../models'
import { RecipeList } from '../components'
import { getUser, getUserRecipes } from '../common/http'

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
          <title>
            {user.username} ({user.name}) - Recipes
          </title>
        </Head>
        <ProfileHeader user={user} />
        <RecipeList recipes={recipes} user={user} className="pb-5" />
      </Layout>
    )
  }
}
