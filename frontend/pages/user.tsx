import React from 'react'
import ErrorPage from './_error'
import { Layout, ProfileHeader } from '../components'
import Head from 'next/head'
import { UserJSON } from '../models/user'
import { RecipePreview } from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user?: UserJSON
  statusCode?: number
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query, res }) {
    try {
      const { username } = query
      return {
        user: await api.getUser(username)
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
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <Layout>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <ProfileHeader user={user} />
        <RecipePreview recipes={user.recipes} user={user} />
      </Layout>
    )
  }
}
