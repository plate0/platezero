import React from 'react'
import { Col, Row } from 'reactstrap'
import { Layout, ProfileHeader, ProfileNav, IfLoggedIn } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipeCard } from '../components/RecipeCard'
import { getUser } from '../common/http'
import { Link } from '../routes'

interface UserProps {
  user: UserJSON
}

const RecipeListBlankslate = (props: { username: string }) => (
  <div className="bg-light text-secondary text-center rounded p-5 mt-3">
    <h1>No recipes yet :(</h1>
    <IfLoggedIn username={props.username}>
      <Link route="/recipes/new">
        <a className="btn btn-primary">Create your first!</a>
      </Link>
    </IfLoggedIn>
  </div>
)

const ListRecipes = props => (
  <Row>
    {!props.recipes.length && (
      <Col>
        <RecipeListBlankslate {...props} />
      </Col>
    )}
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
        <ProfileHeader user={user} />
        <ProfileNav username={user.username} />
        <ListRecipes recipes={user.recipes} username={user.username} />
      </Layout>
    )
  }
}
