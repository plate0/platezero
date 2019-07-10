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
  RecipeList,
  RecipeListBlankslate,
  RecipeListNoSearchResults,
  Search,
  SortRecipes,
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

interface UserState {
  query: string
  sort: string
  recipes: RecipeJSON[]
}

async function getRecipes({
  username,
  q,
  sort
}: {
  username: string
  q?: string
  sort?: string
}): Promise<RecipeJSON[]> {
  if (q) {
    return _.map(await api.searchUserRecipes({ username, q, sort }), 'recipe')
  }
  return await api.getUserRecipes(username, sort)
}

class User extends React.Component<UserProps & WithRouterProps, UserState> {
  constructor(props: any) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onClear = this.onClear.bind(this)
    this.state = {
      sort: props.sort || '',
      query: props.query || '',
      recipes: props.recipes
    }
  }

  static async getInitialProps({ query, res }) {
    try {
      const { username, q, sort } = query
      return {
        user: await api.getUser(username),
        query: q,
        sort,
        recipes: await getRecipes({ username, q, sort })
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
      query: { q, username, sort }
    } = this.props.router
    q = _.isArray(q) ? _.first(q) : q
    sort = _.isArray(sort) ? _.first(sort) : sort
    username = _.isArray(username) ? _.first(username) : username
    if (
      q !== prevProps.router.query.q ||
      sort !== prevProps.router.query.sort ||
      username !== prevProps.router.query.username
    ) {
      this.setState(
        {
          sort: (sort as string) || '',
          query: (q as string) || '',
          ...(q ? {} : { recipes: await getRecipes({ username, q, sort }) })
        },
        q || sort ? this.refresh : undefined
      )
    }
  }

  public onSearch(q: string) {
    const { pathname } = parse(this.props.router.asPath)
    const { sort } = this.state
    const query = stringify({ q, sort })
    const href = `${pathname}?${query}`
    Router.replaceRoute(href, { shallow: true })
  }

  public onSort(e: any) {
    const sort = e.target.value
    const q = this.state.query
    const { pathname } = parse(this.props.router.asPath)
    const query = stringify({ q, sort })
    const href = `${pathname}?${query}`
    Router.replaceRoute(href, { shallow: true })
  }

  public onClear() {
    const { pathname } = parse(this.props.router.asPath)
    Router.replaceRoute(pathname, pathname, { shallow: true })
  }

  refresh = _.debounce(async () => {
    const { user } = this.props
    const { query, sort } = this.state
    this.setState({
      recipes: await getRecipes({ username: user.username, q: query, sort })
    })
  }, 500)

  public render() {
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const { recipes, query, sort } = this.state
    return (
      <Layout title={getName(user)}>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col xs={12} sm={4} md={3} lg={2} className="text-center">
            <ProfilePicture size={64} img={user.avatar_url} />
            <IfLoggedIn>
              <p>
                <Link route="profile">
                  <a className="btn btn-link">Edit Profile</a>
                </Link>
              </p>
            </IfLoggedIn>
          </Col>
          <Col xs={12} sm={8} md={9} lg={10}>
            <h2 className="m-0">Recipes</h2>
            <Row className="align-items-center">
              <Col>
                <Search
                  value={query}
                  onChange={this.onSearch}
                  placeholder="Find a recipe..."
                  className="my-2"
                />
              </Col>
              <Col xs="auto">
                <SortRecipes selected={sort} onSort={this.onSort} />
              </Col>
            </Row>
            <RecipeList recipes={recipes}>
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
