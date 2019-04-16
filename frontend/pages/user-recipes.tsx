import React from 'react'
import ErrorPage from './_error'
import { Layout } from '../components'
import Head from 'next/head'
import { RecipeJSON, UserJSON } from '../models'
import { RecipeList } from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user?: UserJSON
  recipes?: RecipeJSON[]
  statusCode?: number
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query, res }) {
    const { username } = query
    try {
      return {
        user: await api.getUser(username),
        recipes: await api.getUserRecipes(username)
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    const { user, recipes, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
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
