import React from 'react'
import { Recipe as RecipeModel } from '../models/recipe'
const {
  routes: { Link }
} = require('../routes')

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
      <h1>
        <Link route={`/${owner.username}/recipes`}>
          <a>{owner.username}</a>
        </Link>
        <span className="text-secondary"> / </span>
        <a>{recipe.title}</a>
      </h1>
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
