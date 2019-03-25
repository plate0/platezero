import React from 'react'
import { RecipeJSON } from '../models/recipe'
import { UserCard } from '../components'
import { Link } from '../routes'

interface RecipeNavProps {
  recipe: RecipeJSON
}

export const RecipeNav = (props: RecipeNavProps) => {
  const { recipe } = props
  const { owner } = recipe
  return (
    <div className="my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>
            <Link route={`/${owner.username}/${recipe.slug}`}>
              <a>{recipe.title}</a>
            </Link>
          </h1>
          {recipe.subtitle && <div className="lead">{recipe.subtitle}</div>}
        </div>
        <UserCard user={owner} />
      </div>
    </div>
  )
}
