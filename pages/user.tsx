import * as _ from 'lodash'
import { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import React from 'react'
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'
import parse from 'url-parse'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import {
  IfLoggedIn,
  Layout,
  ProfilePicture,
  RecipeList,
  UserPageRecipes
} from '../components'
import { RecipeJSON, UserJSON } from '../models'
import ErrorPage from './_error'

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
                <Link href="profile">
                  <a className="btn btn-link">Edit Profile</a>
                </Link>
              </p>
            </IfLoggedIn>
          </Col>
          <Col xs={12} sm={8} md={9} lg={10}>
            <Nav tabs>
              <NavItem>
                <Link href={`/${user.username}`} passHref>
                  <NavLink active={tab !== FAVORITES}>Recipes</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href={`/${user.username}?tab=favorites`} passHref>
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
