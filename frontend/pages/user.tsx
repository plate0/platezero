import React from 'react'
import { Col, Row } from 'reactstrap'
import { Layout, ProfileHeader, IfLoggedIn } from '../components'
import Head from 'next/head'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'
import { RecipeJSON } from '../models/recipe'
import { RecipeCard } from '../components/RecipeCard'
import { getUser } from '../common/http'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'

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

interface RecipesProps {
  user: UserJSON
  recipes: RecipeJSON[]
}

const Recipes = ({ recipes, user }: RecipesProps) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <section>
      <Row className="align-items-center border-bottom">
        <Col xs="10">
          <IfLoggedIn username={user.username} else={not}>
            {me}
          </IfLoggedIn>
        </Col>
        <Col xs="2" className="text-center">
          <Link to={`/${user.username}/recipes`}>
            <a>See All</a>
          </Link>
        </Col>
      </Row>
      <Row>
        {!recipes.length && (
          <Col>
            <RecipeListBlankslate username={user.username} />
          </Col>
        )}
        {recipes.map(r => (
          <Col xs="12" md="4" xl="3" key={r.slug} className="mt-3">
            <RecipeCard
              title={r.title}
              slug={r.slug!}
              image_url={r.image_url}
              username={user.username}
            />
          </Col>
        ))}
      </Row>
    </section>
  )
}

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
        <Recipes recipes={user.recipes} user={user} />
      </Layout>
    )
  }
}
