import React from 'react'

import { RecipeJSON } from '../models'
import { Markdown } from './Markdown'

export const RecipeTitle = ({ recipe }: { recipe: RecipeJSON }) => (
  <>
    <div itemProp="name">
      <h1>{recipe.title}</h1>
      {recipe.subtitle && <p className="lead">{recipe.subtitle}</p>}
    </div>
    {recipe.description && (
      <div className="text-secondary mb-3" itemProp="description">
        <Markdown source={recipe.description} />
      </div>
    )}
  </>
)
