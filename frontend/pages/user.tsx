import React from 'react'
import { Col, Row } from 'reactstrap'
import { Layout, ProfileHeader, ProfileNav } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipeCard } from '../components/RecipeCard'
import { getUser } from '../common/http'

interface UserProps {
  user: UserJSON
}

const ListRecipes = props => (
  <Row>
    {props.recipes.map(r => (
      <Col xs="12" md="4" xl="3" key={r.slug} className="mt-3">
        <RecipeCard {...r} username={props.username} />
      </Col>
    ))}
  </Row>
)

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
        <ProfileHeader {...user} />
        <ProfileNav username={user.username} />
        <ListRecipes recipes={user.recipes} username={user.username} />
      </Layout>
    )
  }
}
