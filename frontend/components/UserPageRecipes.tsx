import React, { useState, useEffect } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { stringify } from 'query-string'
import * as _ from 'lodash'

import { RecipeJSON, UserJSON } from '../models'
import { Search } from './Search'
import { SortRecipes } from './Sort'
import { RecipeList } from './RecipeList'
import {
  RecipeListBlankslate,
  RecipeListNoSearchResults
} from './RecipeListBlankslate'
import { Router } from '../routes'
import { api } from '../common/http'
import { useDebounce } from '../hooks/useDebounce'

export const UserPageRecipes = ({
  initialQuery,
  initialSort,
  initialRecipes,
  username,
  baseURL
}: {
  query?: string
  sort?: string
  recipes: RecipeJSON[]
  username: string
  baseURL: string
}) => {
  const [query, setQuery] = useState(initialQuery || '')
  const [sort, setSort] = useState(initialSort || '')
  const [recipes, setRecipes] = useState(initialRecipes)
  const [queryString, setQueryString] = useState({})
  const [href, setHref] = useState(`${baseURL}?${stringify(queryString)}`)
  const debouncedQueryString = useDebounce(queryString, 500)

  // update query string when params change
  useEffect(() => {
    setQueryString({ sort, q: query })
  }, [sort, query])

  // update href when query params change
  useEffect(() => {
    const qs = stringify(_.omitBy(queryString, v => _.trim(v) === ''))
    if (qs) {
      setHref(`${baseURL}?${qs}`)
    } else {
      setHref(baseURL)
    }
  }, [baseURL, queryString])

  // replace route when href changes
  useEffect(() => {
    Router.replaceRoute(href, { shallow: true })
  }, [href])

  // load new recipes
  useEffect(() => {
    const loadRecipes = async () => {
      setRecipes(
        await api.getRecipes({
          username: username,
          q: debouncedQueryString.q,
          sort: debouncedQueryString.sort
        })
      )
    }
    loadRecipes()
  }, [username, debouncedQueryString])

  const clear = () => {
    setQuery('')
    setSort('')
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Search
            value={query}
            onChange={q => setQuery(q)}
            placeholder="Find a recipe..."
            className="my-2"
          />
        </Col>
        <Col xs="auto">
          <SortRecipes selected={sort} onSort={e => setSort(e.target.value)} />
        </Col>
      </Row>
      <RecipeList recipes={recipes}>
        {query && (
          <SearchResultsHeader
            n={recipes.length}
            q={query}
            className="border-bottom"
            onClear={clear}
          />
        )}
        {!recipes.length && query && (
          <RecipeListNoSearchResults username={username} />
        )}
        {!recipes.length && !query && (
          <RecipeListBlankslate username={username} />
        )}
      </RecipeList>
    </>
  )
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
