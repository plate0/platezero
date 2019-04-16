import React from 'react'
import * as ReactMarkdown from 'react-markdown'

import { RecipeJSON } from '../models'

export const RecipeTitle = ({ recipe }: { recipe: RecipeJSON }) => (
  <>
    <div itemProp="name">
      <h1>{recipe.title}</h1>
      {recipe.subtitle && <p className="lead">{recipe.subtitle}</p>}
    </div>
    {recipe.description && (
      <div className="text-secondary mb-3" itemProp="description">
        <ReactMarkdown source={recipe.description} />
      </div>
    )}
  </>
)
