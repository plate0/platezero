import React from 'react'
import * as _ from 'lodash'
import { Row, Col } from 'reactstrap'

import { RecipeJSON, UserJSON } from '../models'
import { RecipeCard } from './RecipeCard'
import { IfLoggedIn } from './IfLoggedIn'
import { RecipeListBlankslate } from './RecipeListBlankslate'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'

export const RecipePreview = ({
  recipes,
  user
}: {
  recipes: RecipeJSON[]
  user: UserJSON
}) => {
  const smalls = mapToPreviewRow(recipes, 3, 'd-xl-none', user.username)
  const larges = mapToPreviewRow(recipes, 4, 'd-none d-xl-block', user.username)
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <section>
      <Row className="align-items-center border-bottom pb-1 mb-3">
        <Col>
          <IfLoggedIn username={user.username} else={not}>
            {me}
          </IfLoggedIn>
        </Col>
        <IfLoggedIn username={user.username}>
          <Col xs="auto">
            <Link route="new-recipe">
              <a role="button" className="btn btn-link">
                Add Recipe
              </a>
            </Link>
          </Col>
        </IfLoggedIn>
      </Row>
      <Row>
        {!recipes.length && (
          <Col>
            <RecipeListBlankslate username={user.username} />
          </Col>
        )}
        {smalls}
        {larges}
      </Row>
    </section>
  )
}

const mapToPreviewRow = (
  recipes: RecipeJSON[],
  max: number,
  className: string,
  username: string
) => {
  return _.reject(
    _.map(recipes, (r, idx) => {
      const cardCol = (
        <RecipeCol className={className} key={idx}>
          <RecipeCard
            title={r.title}
            slug={r.slug!}
            image_url={r.image_url}
            username={username}
          />
        </RecipeCol>
      )
      if (idx < max - 1) {
        return cardCol
      }
      if (idx === max - 1) {
        return _.size(recipes) > max ? (
          <RecipeCol className={className} key={idx}>
            <SeeMore username={username} />
          </RecipeCol>
        ) : (
          cardCol
        )
      }
    }),
    _.isUndefined
  )
}

const RecipeCol = ({
  className,
  children
}: {
  className?: string
  children: any
}) => (
  <Col xs="12" md="4" xl="3" className={`mb-3 ${className || ''}`}>
    {children}
  </Col>
)

const SeeMore = ({ username }: { username: string }) => (
  <>
    <div className="d-md-none">
      <Link to={`/${username}/recipes`}>
        <a className="btn btn-block btn-secondary">See more&hellip;</a>
      </Link>
    </div>
    <div
      className="d-none d-md-flex align-items-center justify-content-center bg-light"
      style={{ height: 180 }}
    >
      <Link to={`/${username}/recipes`}>
        <a className="text-secondary stretched-link">See more&hellip;</a>
      </Link>
    </div>
  </>
)
