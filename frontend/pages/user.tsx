import React from 'react'
import * as _ from 'lodash'
import { Row, Col, Button, Nav, NavItem, NavLink } from 'reactstrap'
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
  RecipeList,
  ProfilePicture,
  IfLoggedIn
} from '../components'
import { UserJSON, RecipeJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

const FAVORITES = 'favorites'

interface UserProps {
  query?: string
  sort?: string
  tab?: string
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
      const { username, q, sort, tab } = query
      const recipes =
        tab === FAVORITES
          ? _.map(await api.getFavorites(username), 'recipe')
          : await api.getRecipes({ username, q, sort })
      return {
        user: await api.getUser(username),
        query: q,
        sort,
        tab,
        recipes
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
    const { recipes, query, sort, tab } = this.props
    return (
      <Layout title={getName(user)}>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col xs={12} sm={4} md={3} lg={2} className="text-center">
            <ProfilePicture size={64} img={user.avatar_url} />
            <h3>{getName(user)}</h3>
            <IfLoggedIn username={user.username}>
              <p>
                <Link route="profile">
                  <a className="btn btn-link">Edit Profile</a>
                </Link>
              </p>
            </IfLoggedIn>
          </Col>
          <Col xs={12} sm={8} md={9} lg={10}>
            <Nav tabs>
              <NavItem>
                <Link to={`/${user.username}`} passHref>
                  <NavLink active={tab !== FAVORITES}>Recipes</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link to={`/${user.username}?tab=favorites`} passHref>
                  <NavLink active={tab === FAVORITES}>Favorites</NavLink>
                </Link>
              </NavItem>
            </Nav>
            {tab === FAVORITES ? (
              <RecipeList recipes={recipes} />
            ) : (
              <UserPageRecipes
                initialQuery={query}
                initialSort={sort}
                initialRecipes={recipes}
                username={user.username}
                baseURL={parse(this.props.router.asPath).pathname}
              />
            )}
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default withRouter(User)
