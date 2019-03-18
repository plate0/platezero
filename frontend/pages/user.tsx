import React from 'react'
import { Layout, ProfileHeader } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipeList } from '../components'
import { getUser } from '../common/http'

interface UserProps {
  user: UserJSON
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps(ctx) {
    const { username } = ctx.query
    const { token } = nextCookie(ctx)
    return {
      user: await getUser(username, { token })
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
        <RecipeList recipes={user.recipes} user={user} seeAll={true} />
      </Layout>
    )
  }
}
