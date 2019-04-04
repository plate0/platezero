import React from 'react'

import { RecipeJSON } from '../models'

export const RecipeTitle = ({ recipe }: { recipe: RecipeJSON }) => (
  <>
    <h1>{recipe.title}</h1>
    {recipe.subtitle && <p className="lead">{recipe.subtitle}</p>}
  </>
)
