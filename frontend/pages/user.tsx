import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import {
  Layout,
  Navbar,
  ProfilePicture,
  ProfileHeader,
  ProfileNav
} from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { User as UserModel } from '../models/user'
import { Recipe as RecipeModel } from '../models/recipe'
import { RecipeCard } from '../components/RecipeCard'
import { getUser, getUserRecipes } from '../common/http'
const {
  routes: { Link }
} = require('../routes')

interface UserProps {
  user: UserModel
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
    const { token } = nextCookie(ctx)
    const {
      query: { username }
    } = ctx
    return {
      user: await getUser(username, { token })
    }
  }

  public render() {
    const { user } = this.props
    return (
      <Layout user={user}>
        <Head>
          <title>
            {user.username} ({user.name})
          </title>
        </Head>
        <ProfileHeader {...user} />
        <ProfileNav username={user.username} />
        <Link route={`/${user.username}/recipe/new`}>
          <a className="btn btn-primary">New Recipe</a>
        </Link>
        <ListRecipes recipes={user.recipes} username={user.username} />
      </Layout>
    )
  }
}
