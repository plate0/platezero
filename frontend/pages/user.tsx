import React from 'react'
import Link from 'next/link'
import { Button, Col, Row } from 'reactstrap'
import {
  Layout,
  Navbar,
  ProfilePicture,
  ProfileHeader,
  ProfileNav
} from '../components'
import Head from 'next/head'
import { User as UserModel } from '../models/user'
import { Recipe as RecipeModel } from '../models/recipe'
import { RecipeCard } from '../components/RecipeCard'
import 'isomorphic-fetch'

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
  static async getInitialProps({ query }) {
    const { username } = query
    const options = {
      method: 'GET'
    }
    const host = 'http://localhost:9100/api'
    const user = await fetch(`${host}/users/${username}`, options)
    const recipes = await fetch(`${host}/users/${username}/recipes`, options)
    return {
      user: await user.json(),
      recipes: await recipes.json()
    }
  }

  public render() {
    console.log('props', this.props)
    return (
      <Layout>
        <Head>
          <title>{this.props.user.username}</title>
        </Head>
        <ProfileHeader {...this.props.user} />
        <ProfileNav username={this.props.user.username} />
        <ListRecipes
          recipes={this.props.recipes}
          username={this.props.user.username}
        />
      </Layout>
    )
  }
}
