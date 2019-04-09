import React from 'react'
import * as _ from 'lodash'

import {
  Head,
  Layout,
  RecipeVersion as RecipeVersionView,
  RecipeTitle,
  RecipeNav
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getRecipe, getRecipeVersion } from '../common/http'

interface Props {
  recipe: RecipeJSON
  recipeVersion?: RecipeVersionJSON
  pathname: string
}

interface State {
  showEditModal: boolean
}

export default class Recipe extends React.Component<Props, State> {
  static async getInitialProps({ pathname, query }): Promise<Props> {
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { recipe, recipeVersion, pathname }
  }

  constructor(props) {
    super(props)
    this.showEditModal = this.showEditModal.bind(this)
    this.state = { showEditModal: false }
  }

  public showEditModal(showEditModal: boolean): void {
    this.setState({ showEditModal })
  }

  public render() {
    const { recipe, recipeVersion } = this.props
    return (
      <Layout>
        <Head
          title={`${recipe.title} - PlateZero`}
          description={recipe.description}
          image={recipe.image_url}
          url={`/${recipe.owner.username}/${recipe.slug}`}
        />
        <div className="mt-3">
          <RecipeTitle recipe={recipe} />
        </div>
        <RecipeNav recipe={recipe} route={this.props.pathname} />
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
      </Layout>
    )
  }
}
