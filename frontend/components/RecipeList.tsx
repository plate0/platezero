import React, { useContext } from 'react'
import { Col, Row } from 'reactstrap'
import { UserJSON, RecipeJSON } from '../models'
import { RecipeCard } from './RecipeCard'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { IfLoggedIn } from './IfLoggedIn'
import { UserContext } from '../context/UserContext'

export interface RecipesProps {
  user: UserJSON
  recipes: RecipeJSON[]
  seeAll?: boolean
}

export const RecipeList = ({ recipes, seeAll, user }: RecipesProps) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  const loggedInUser = useContext(UserContext)
  return (
    <section>
      <Row className="align-items-center border-bottom pb-1">
        <Col xs={8 + (loggedInUser ? 0 : 3) + (seeAll ? 0 : 1)}>
          <IfLoggedIn username={user.username} else={not}>
            {me}
          </IfLoggedIn>
        </Col>
        <IfLoggedIn username={user.username}>
          <Col xs="3" className="d-flex justify-content-around">
            <Link route="new-recipe">
              <a role="button" className="btn btn-primary">
                Add Recipe
              </a>
            </Link>
            <Link route="import-recipe">
              <a role="button" className="btn btn-primary">
                Import Recipe
              </a>
            </Link>
          </Col>
        </IfLoggedIn>
        {seeAll && (
          <Col xs="1" className="text-right">
            <Link to={`/${user.username}/recipes`}>
              <a>See All</a>
            </Link>
          </Col>
        )}
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
