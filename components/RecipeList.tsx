import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { RecipeJSON } from '../models'
import { Link } from '../routes'
import { Image } from './Image'

export interface RecipesProps {
  children?: any
  recipes: RecipeJSON[]
}

export const RecipeList = ({ children, recipes }: RecipesProps) => {
  return (
    <section className="my-3">
      {children}
      <ListGroup className="mt-3" flush>
        {recipes.map((recipe) => (
          <ListGroupItem key={recipe.id} className="px-0">
            <Link route={recipe.html_url}>
              <a className="d-flex flex-row">
                <Image
                  width="80"
                  height="50"
                  src={
                    recipe.image_url ||
                    'https://static.platezero.com/recipe-placeholder-sm.jpg'
                  }
                />
                <div className="pl-2 col-9 col-md-10 col-lg-11">
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
