import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import { Layout, Navbar } from '../components'
import Head from 'next/head'
import { User as UserModel } from '../models'
import { RecipeCard } from '../components/RecipeCard'

const user = {
  username: 'em'
}

const recipes = [{ name: 'Pizza', slug: 'pizza' }]

interface UserProps {
  user: UserModel
}

const Picture = () => (
  <div>
    <img src="https://avatars1.githubusercontent.com/u/166767?s=400&u=e886e1b9ac8905da23d5db88d96b669cdb3aee45" />
  </div>
)

const ProfileNav = () => (
  <Row>
    <Col>Recipes</Col>
    <Col>Tares</Col>
  </Row>
)

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query }) {
    return { user }
  }

  public render() {
    const recis = recipes.map(r => <RecipeCard {...r} key={r.slug} />)
    return (
      <Layout>
        <Head>
          <title>{this.props.user.username}</title>
        </Head>
        <Row>
          <Picture />
        </Row>
        <ProfileNav />
        {recis}
      </Layout>
    )
  }
}
