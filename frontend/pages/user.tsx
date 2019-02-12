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
import { getUser } from '../common/http'
const {
  routes: { Link }
} = require('../routes')

interface UserProps {
  user: UserModel
  recipes: RecipeModel
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
    console.log('User Initial Props', nextCookie(ctx))
    const { token } = nextCookie(ctx)
    console.log('NEXT COOKIE', token)
    const {
      query: { username }
    } = ctx
    return {
      user: await getUser(username, { token }),
      recipes: []
    }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.user.username}</title>
        </Head>
        <ProfileHeader {...this.props.user} />
        <ProfileNav username={this.props.user.username} />
        <Link route={`/${this.props.user.username}/recipe/new`}>
          <Button>New Recipe</Button>
        </Link>
        <ListRecipes
          recipes={this.props.recipes}
          username={this.props.user.username}
        />
      </Layout>
    )
  }
}
