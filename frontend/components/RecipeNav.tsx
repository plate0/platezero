import React from 'react'
import { Recipe as RecipeModel } from '../models/recipe'
import { UserCard } from '../components'
import { Link } from '../routes'

interface BranchProps {
  name: string
  selected: boolean
  route: string
}

const Branch = (props: BranchProps) => {
  const color = props.selected ? 'btn-primary' : 'btn-secondary'
  return (
    <Link route={props.route}>
      <a className={'btn btn-sm ' + color}>{props.name}</a>
    </Link>
  )
}

interface RecipeNavProps {
  recipe: RecipeModel
  selectedRecipeVersion?: number
}

export const RecipeNav = (props: RecipeNavProps) => {
  const { recipe } = props
  const { owner, branches } = recipe
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
      <div>
        {branches.map(b => (
          <Branch
            key={b.recipe_version_id}
            name={b.name}
            route={`/${owner.username}/${recipe.slug}/versions/${
              b.recipe_version_id
            }`}
            selected={b.recipe_version_id === props.selectedRecipeVersion}
          />
        ))}
      </div>
    </div>
  )
}
