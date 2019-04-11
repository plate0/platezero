import React from 'react'
import * as ReactMarkdown from 'react-markdown'

import { RecipeJSON } from '../models'

export const RecipeTitle = ({ recipe }: { recipe: RecipeJSON }) => (
  <>
    <h1>{recipe.title}</h1>
    {recipe.subtitle && <p className="lead">{recipe.subtitle}</p>}
    {recipe.description && (
      <div className="text-secondary mb-3">
        <ReactMarkdown source={recipe.description} />
      </div>
    )}
  </>
)
