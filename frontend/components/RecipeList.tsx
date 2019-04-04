import React from 'react'
import { Col, Row } from 'reactstrap'
import * as _ from 'lodash'

import { UserJSON, RecipeJSON } from '../models'
import { RecipeCard } from './RecipeCard'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { IfLoggedIn } from './IfLoggedIn'

export interface RecipesProps {
  user: UserJSON
  recipes: RecipeJSON[]
  seeAll?: boolean
  className?: string
}

export const RecipeList = ({
  className,
  recipes,
  seeAll,
  user
}: RecipesProps) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <section className={className ? className : ''}>
      <Row className="align-items-center border-bottom pb-1">
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
            </Link>{' '}
            <Link route="import-recipe">
              <a role="button" className="btn btn-link">
                Import Recipe
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
        {seeAll ? (
          <PreviewRecipeList recipes={recipes} user={user} />
        ) : (
          <FullRecipeList recipes={recipes} user={user} />
        )}
      </Row>
    </section>
  )
}

export const RecipeListBlankslate = (props: { username: string }) => (
  <div className="bg-light text-secondary text-center rounded p-5 mt-3">
    <h1>No recipes yet :(</h1>
    <IfLoggedIn username={props.username}>
      <Link route="/recipes/new">
        <a className="btn btn-primary">Create your first!</a>
      </Link>
    </IfLoggedIn>
  </div>
)

const RecipeCol = ({
  className,
  children
}: {
  className?: string
  children: any
}) => (
  <Col xs="12" md="4" xl="3" className={`mt-3 ${className || ''}`}>
    {children}
  </Col>
)

const SeeMore = ({ username }: { username: string }) => (
  <div
    style={{
      backgroundColor: 'var(--light)',
      height: 180,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Link to={`/${username}/recipes`}>
      <a className="text-secondary stretched-link">See more&hellip;</a>
    </Link>
  </div>
)

const PreviewRecipeList = ({
  recipes,
  user
}: {
  recipes: RecipeJSON[]
  user: UserJSON
}) => {
  const smalls = mapToPreviewRow(recipes, 3, 'd-xl-none', user.username)
  const larges = mapToPreviewRow(recipes, 4, 'd-none d-xl-block', user.username)
  return (
    <>
      {smalls}
      {larges}
    </>
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

export const FullRecipeList = ({
  user,
  recipes
}: {
  user: UserJSON
  recipes: RecipeJSON[]
}) => {
  return (
    <>
      {recipes.map(r => (
        <RecipeCol key={r.slug}>
          <RecipeCard
            title={r.title}
            slug={r.slug!}
            image_url={r.image_url}
            username={user.username}
          />
        </RecipeCol>
      ))}
    </>
  )
}
