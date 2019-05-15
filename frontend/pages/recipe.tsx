import React from 'react'
import * as _ from 'lodash'
import ErrorPage from './_error'
import { RecipeLayout, RecipeVersion, PinnedNotes } from '../components'
import { RecipeJSON, RecipeVersionJSON, NoteJSON } from '../models'
import { api } from '../common/http'

// Given a Recipe populated with branches and owner, and optionally a recipe
// version ID, fetch the requested version falling back to the master version
// if a specific one was not specified
async function getMasterVersion(
  recipe: RecipeJSON
): Promise<RecipeVersionJSON> {
  const masterBranch = _.find(recipe.branches, { name: 'master' })
  if (!masterBranch) {
    throw new Error('Could not find master recipe version')
  }
  return await api.getRecipeVersion(
    recipe.owner.username,
    recipe.slug,
    masterBranch.recipe_version_id
  )
}

interface Props {
  recipe?: RecipeJSON
  masterVersion?: RecipeVersionJSON
  notes?: NoteJSON[]
  pathname: string
  statusCode?: number
}

export default class Recipe extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    try {
      const { username, slug } = query
      const recipe = await api.getRecipe(username, slug)
      const masterVersion = await getMasterVersion(recipe)
      const notes = await api.getRecipeNotes(username, slug)
      return { recipe, masterVersion, notes, pathname }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { pathname, statusCode }
    }
  }

  public componentDidMount() {
    setTimeout(() => (document.body.scrollTop = 56))
  }

  public render() {
    const { recipe, masterVersion, notes, statusCode, pathname } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <RecipeLayout
        recipe={recipe}
        title={`${recipe.title} - PlateZero`}
        description={recipe.description}
        url={`/${recipe.owner.username}/${recipe.slug}`}
        noteCount={notes.length}
        pathname={pathname}
      >
        {recipe.description && (
          <p style={{ lineHeight: '2rem' }}>{recipe.description}</p>
        )}
        <PinnedNotes
          currentVersionId={masterVersion.id}
          recipe={recipe}
          notes={notes}
        />
        <RecipeVersion version={masterVersion} />
      </RecipeLayout>
    )
  }
}
