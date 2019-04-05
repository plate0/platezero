import React from 'react'
import { Col, Row, ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'

import { UserJSON, RecipeJSON } from '../models'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { IfLoggedIn } from './IfLoggedIn'
import { RecipeListBlankslate } from './RecipeListBlankslate'

export interface RecipesProps {
  user: UserJSON
  recipes: RecipeJSON[]
}

export const RecipeList = ({ recipes, user }: RecipesProps) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <section className="my-3">
      <Row className="align-items-center">
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
      {!recipes.length && <RecipeListBlankslate username={user.username} />}
      <ListGroup className="mt-3">
        {recipes.map(recipe => {
          const style = recipe.image_url
            ? {
                backgroundImage: `url(${recipe.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.85)'
              }
            : undefined
          return (
            <ListGroupItem key={recipe.id} style={style}>
              <div>
                <Link route={`/${user.username}/${recipe.slug}`}>
                  <a className="text-dark stretched-link">
                    <strong>{recipe.title}</strong>
                  </a>
                </Link>
              </div>
              <div className="small text-muted text-truncate">
                {recipe.description || 'by ' + getName(recipe.owner)}
              </div>
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </section>
  )
}
