import React from 'react'
import * as _ from 'lodash'
import ErrorPage from './_error'
import {
  Head,
  Layout,
  RecipeVersion as RecipeVersionView,
  RecipeTitle,
  RecipeNav
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { api } from '../common/http'
import '../style/recipe.scss'

interface Props {
  recipe?: RecipeJSON
  recipeVersion?: RecipeVersionJSON
  pathname: string
  statusCode?: number
}

export default class Recipe extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    try {
      const recipe = await api.getRecipe(query.username, query.slug)
      const masterBranch = _.head(
        _.filter(recipe.branches, r => r.name === 'master')
      )
      const versionId = _.get(masterBranch, 'recipe_version_id')
      const recipeVersion = versionId
        ? await api.getRecipeVersion(query.username, query.slug, versionId)
        : undefined
      return { recipe, recipeVersion, pathname }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { pathname, statusCode }
    }
  }

  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    setTimeout(() => (document.body.scrollTop = 56))
  }

  public render() {
    const { recipe, recipeVersion, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <>
        <Layout>
          <Head
            title={`${recipe.title} - PlateZero`}
            description={recipe.description}
            image={recipe.image_url}
            url={`/${recipe.owner.username}/${recipe.slug}`}
          />
          {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
        </Layout>
      </>
    )
  }
}
