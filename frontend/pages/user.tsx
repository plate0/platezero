import React from 'react'
import * as _ from 'lodash'
import { Row, Col, Button } from 'reactstrap'
import Head from 'next/head'
import { withRouter, WithRouterProps } from 'next/router'
import * as parse from 'url-parse'
import ErrorPage from './_error'
import { Router } from '../routes'
import {
  Layout,
  UserSidebar,
  RecipeList,
  RecipeListHeader,
  RecipeListBlankslate,
  RecipeListNoSearchResults,
  Search
} from '../components'
import { UserJSON, RecipeJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  query?: string
  user?: UserJSON
  recipes?: RecipeJSON[]
  statusCode?: number
}

interface UserState {
  query: string
  recipes: RecipeJSON[]
}

class User extends React.Component<UserProps & WithRouterProps, UserState> {
  constructor(props: any) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
    this.onClear = this.onClear.bind(this)
    this.state = {
      query: props.query || '',
      recipes: props.recipes
    }
  }

  static async getInitialProps({ query, res }) {
    try {
      const { username, q } = query
      return {
        user: await api.getUser(username),
        query: q,
        recipes: await api.getUserRecipes(username, q)
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public async componentDidUpdate(prevProps) {
    let {
      query: { q, username }
    } = this.props.router
    q = _.isArray(q) ? _.first(q) : q
    username = _.isArray(username) ? _.first(username) : username
    if (q !== prevProps.router.query.q) {
      this.setState(
        {
          query: (q as string) || '',
          ...(q ? {} : { recipes: await api.getUserRecipes(username, q) })
        },
        q ? this.refresh : undefined
      )
    }
  }

  public onSearch(q: string) {
    const { pathname } = parse(this.props.router.asPath)
    const href = `${pathname}?q=${encodeURIComponent(q)}`
    Router.replaceRoute(href, { shallow: true })
  }

  public onClear() {
    const { pathname } = parse(this.props.router.asPath)
    Router.replaceRoute(pathname, pathname, { shallow: true })
  }

  refresh = _.debounce(async () => {
    const { user } = this.props
    const { query } = this.state
    this.setState({
      recipes: await api.getUserRecipes(user.username, query)
    })
  }, 200)

  public render() {
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const { recipes, query } = this.state
    return (
      <Layout>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col xs={12} sm={4} md={3} lg={2}>
            <UserSidebar user={user} />
          </Col>
          <Col xs={12} sm={8} md={9} lg={10}>
            <RecipeListHeader user={user} />
            <Search
              value={query}
              onChange={this.onSearch}
              placeholder="Find a recipe..."
              className="my-2"
            />
            <RecipeList recipes={recipes} user={user}>
              {query && (
                <SearchResultsHeader
                  n={recipes.length}
                  q={query}
                  className="border-bottom"
                  onClear={this.onClear}
                />
              )}
              {!recipes.length && query && (
                <RecipeListNoSearchResults username={user.username} />
              )}
              {!recipes.length && !query && (
                <RecipeListBlankslate username={user.username} />
              )}
            </RecipeList>
          </Col>
        </Row>
      </Layout>
    )
  }
}

const SearchResultsHeader = ({ n, q, className, onClear }) => (
  <Row className={`py-2 align-items-center ${className || ''}`}>
    <Col xs="6" md="10">
      <strong>{n}</strong> results for recipes matching <strong>{q}</strong>
    </Col>
    <Col xs="6" md="2" className="d-flex justify-content-end">
      <Button outline onClick={onClear}>
        Clear Search
      </Button>
    </Col>
  </Row>
)

export default withRouter(User)
