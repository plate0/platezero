import React from 'react'
import { Layout, ProfileHeader } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipePreview } from '../components'
import { getUser } from '../common/http'
import { getName } from '../common/model-helpers'

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
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <ProfileHeader user={user} />
        <RecipePreview recipes={user.recipes} user={user} />
      </Layout>
    )
  }
}
