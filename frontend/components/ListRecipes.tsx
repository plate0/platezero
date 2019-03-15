import React from 'react'
import { Col, Row } from 'reactstrap'
import { UserJSON, RecipeJSON } from '../models'
import { RecipeCard } from './RecipeCard'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { IfLoggedIn } from './IfLoggedIn'

export interface RecipesProps {
  user: UserJSON
  recipes: RecipeJSON[]
}

export const RecipeList = ({ recipes, user }: RecipesProps) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <section>
      <Row className="align-items-center border-bottom">
        <Col xs="10">
          <IfLoggedIn username={user.username} else={not}>
            {me}
          </IfLoggedIn>
        </Col>
        <Col xs="2" className="text-right">
          <Link to={`/${user.username}/recipes`}>
            <a>See All</a>
          </Link>
        </Col>
      </Row>
      <Row>
        {!recipes.length && (
          <Col>
            <RecipeListBlankslate username={user.username} />
          </Col>
        )}
        {recipes.map(r => (
          <Col xs="12" md="4" xl="3" key={r.slug} className="mt-3">
            <RecipeCard
              title={r.title}
              slug={r.slug!}
              image_url={r.image_url}
              username={user.username}
            />
          </Col>
        ))}
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
