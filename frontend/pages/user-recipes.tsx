import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import * as _ from 'lodash'
import { withRouter, WithRouterProps } from 'next/router'
import { Router } from '../routes'
import Head from 'next/head'
import { Layout } from '../components'
import { RecipeJSON, UserJSON } from '../models'
import {
  RecipeList,
  RecipeListHeader,
  Search,
  RecipeListBlankslate,
  RecipeListNoSearchResults
} from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import * as parse from 'url-parse'

interface UserRecipesProps {
  query?: string
  user: UserJSON
  recipes: RecipeJSON[]
}

interface UserRecipesState {
  recipes: RecipeJSON[]
}

const SearchResultsHeader = ({ n, q, className, onClear }) => (
  <Row className={`py-2 align-items-center ${className || ''}`}>
    <Col xs="10">
      <strong>{n}</strong> results for recipes matching <strong>{q}</strong>
    </Col>
    <Col xs="2" className="d-flex justify-content-end">
      <Button outline onClick={onClear}>
        Clear Search
      </Button>
    </Col>
  </Row>
)

class UserRecipes extends React.Component<
  UserRecipesProps & WithRouterProps,
  UserRecipesState
> {
  constructor(props: any) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
    this.onClear = this.onClear.bind(this)
    this.state = {
      query: props.query || '',
      recipes: props.recipes
    }
  }

  static async getInitialProps({ query }) {
    const { username, q } = query
    return {
      query: q,
      user: await api.getUser(username),
      recipes: await api.getUserRecipes(username, q)
    }
  }

  public async componentDidUpdate(prevProps) {
    const {
      pathname,
      query: { q, username }
    } = this.props.router
    if (q !== prevProps.router.query.q) {
      this.setState(
        {
          query: q || '',
          ...(q ? {} : { recipes: await api.getUserRecipes(username, q) })
        },
        q ? this.refresh : undefined
      )
    }
  }

  public onSearch(q: string) {
    const { pathname } = parse(this.props.router.asPath)
    const href = `${pathname}?q=${encodeURIComponent(q)}`
    const as = href
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
    const { user } = this.props
    const { recipes, query } = this.state
    return (
      <Layout>
        <Head>
          <title>{getName(user)} - Recipes</title>
        </Head>
        <section className="my-3">
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
        </section>
      </Layout>
    )
  }
}

export default withRouter(UserRecipes)
