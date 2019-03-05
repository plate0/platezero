import React from 'react'
import { RecipeVersion as RecipeVersionModel } from '../models/recipe_version'
import { getRecipeVersion } from '../common/http'
import Recipe from './recipe'

interface RecipeVersionProps {
  recipeVersion: RecipeVersionModel
}

export default class RecipeVersion extends React.Component<RecipeVersionProps> {
  static async getInitialProps({ query }) {
    return {
      recipeVersion: await getRecipeVersion(query.username, query.slug, parseInt(query.versionId, 10))
    }
  }

  public render() {
    return (
      <Recipe recipe={this.props.recipeVersion.recipe}>
        <h2>asdf</h2>
      </Recipe>
    )
  }
}
