import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'
import { RecipeJSON } from '../models'
import { Link } from '../routes'
import { imageProxy } from './Image'

export interface RecipesProps {
  children: any
  recipes: RecipeJSON[]
}

export const RecipeList = ({ children, recipes }: RecipesProps) => {
  const [width, height] = [80, 50]
  return (
    <section className="my-3">
      {children}
      <ListGroup className="mt-3" flush>
        {recipes.map(recipe => {
          const url = recipe.image_url
            ? imageProxy(recipe.image_url, `${width}x${height},q80`)
            : '/static/recipe-placeholder-sm.jpg'
          return (
            <ListGroupItem key={recipe.id} className="px-0">
              <Link route={recipe.html_url}>
                <a className="d-flex flex-row">
                  <div>
                    <div
                      style={{
                        width,
                        height,
                        backgroundImage: `url(${url})`,
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
          )
        })}
      </ListGroup>
    </section>
  )
}
