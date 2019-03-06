import React from 'react'
import { Col, Row } from 'reactstrap'
import { Layout, ProfileHeader, ProfileNav, IfLoggedIn } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipeCard } from '../components/RecipeCard'
import { getUser } from '../common/http'
const {
  routes: { Link }
} = require('../routes')

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
        <IfLoggedIn username={user.username}>
          <Link route={`/${user.username}/recipe/new`}>
            <a className="btn btn-primary">New Recipe</a>
          </Link>
        </IfLoggedIn>
        <ListRecipes recipes={user.recipes} username={user.username} />
      </Layout>
    )
  }
}
