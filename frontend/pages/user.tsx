import React from 'react'
import * as _ from 'lodash'
import { Row, Col, Button } from 'reactstrap'
import Head from 'next/head'
import { withRouter, WithRouterProps } from 'next/router'
import * as parse from 'url-parse'
import ErrorPage from './_error'
import { Link, Router } from '../routes'
import { stringify } from 'query-string'
import {
  Layout,
  UserSidebar,
  UserPageRecipes,
  ProfilePicture,
  IfLoggedIn
} from '../components'
import { UserJSON, RecipeJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  query?: string
  sort?: string
  user?: UserJSON
  recipes?: RecipeJSON[]
  statusCode?: number
}

class User extends React.Component<UserProps & WithRouterProps> {
  constructor(props: any) {
    super(props)
  }

  static async getInitialProps({ query, res }) {
    try {
      const { username, q, sort } = query
      return {
        user: await api.getUser(username),
        query: q,
        sort,
        recipes: await api.getRecipes({ username, q, sort })
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const { recipes, query, sort } = this.props
    return (
      <Layout title={getName(user)}>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col xs={12} sm={4} md={3} lg={2} className="text-center">
            <ProfilePicture size={64} img={user.avatar_url} />
            <h3>{user.username}</h3>
            <IfLoggedIn username={user.username}>
              <p>
                <Link route="profile">
                  <a className="btn btn-link">Edit Profile</a>
                </Link>
              </p>
            </IfLoggedIn>
          </Col>
          <Col xs={12} sm={8} md={9} lg={10}>
            <h2 className="m-0">Recipes</h2>
            <UserPageRecipes
              initialQuery={query}
              initialSort={sort}
              initialRecipes={recipes}
              username={user.username}
              baseURL={parse(this.props.router.asPath).pathname}
            />
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default withRouter(User)
