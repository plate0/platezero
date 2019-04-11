import React from 'react'
import { Layout, ProfileHeader } from '../components'
import Head from 'next/head'
import { UserJSON } from '../models/user'
import { RecipePreview } from '../components'
import { api } from '../common/http'

interface UserProps {
  user: UserJSON
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query }) {
    const { username } = query
    return {
      user: await api.getUser(username)
    }
  }

  public render() {
    const { user } = this.props
    return (
      <Layout>
        <Head>
          <title>
            {user.username} ({user.name})
          </title>
        </Head>
        <ProfileHeader user={user} />
        <RecipePreview recipes={user.recipes} user={user} />
      </Layout>
    )
  }
}
