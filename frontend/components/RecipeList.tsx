import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'
import { UserJSON, RecipeJSON } from '../models'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { IfLoggedIn } from './IfLoggedIn'

export const RecipeListHeader = ({ user }: { user: UserJSON }) => {
  const me = <h2 className="m-0">Your Recipes</h2>
  const not = <h2 className="m-0">{getName(user)}&#8217;s Recipes</h2>
  return (
    <IfLoggedIn username={user.username} else={not}>
      {me}
    </IfLoggedIn>
  )
}

export interface RecipesProps {
  children: any
  user: UserJSON
  recipes: RecipeJSON[]
}

export const RecipeList = ({ children, recipes, user }: RecipesProps) => {
  return (
    <section className="my-3">
      {children}
      <ListGroup className="mt-3" flush>
        {recipes.map(recipe => (
          <ListGroupItem key={recipe.id} className="px-0">
            <Link route={`/${user.username}/${recipe.slug}`}>
              <a className="d-flex flex-row">
                <div>
                  <div
                    style={{
                      width: 80,
                      height: 50,
                      backgroundImage: `url(${recipe.image_url ||
                        '/static/recipe-placeholder-sm.jpg'})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover'
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'relative',
                    paddingLeft: '1rem',
                    width: 'calc(100% - 80px)'
                  }}
                >
                  <div className="text-dark text-truncate">
                    <strong>{recipe.title}</strong>
                  </div>
                  {recipe.description && (
                    <div className="small text-muted text-truncate">
                      {recipe.description}
                    </div>
                  )}
                </div>
              </a>
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    </section>
  )
}
