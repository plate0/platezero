import React from 'react'
import ErrorPage from './_error'
import * as _ from 'lodash'
import { RecipeLayout, RecipeNotes } from '../components'
import { RecipeJSON, NoteJSON } from '../models'
import { api } from '../common/http'
import { maybeNumber } from '../common/number'

interface Props {
  recipe?: RecipeJSON
  versionId?: number
  masterVersionId?: number
  notes?: NoteJSON[]
  pathname: string
  statusCode?: number
}

export default class NotesPage extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    try {
      const { username, slug, versionId } = query
      const recipe = await api.getRecipe(username, slug)
      const masterVersionId = _.get(
        _.find(recipe.branches, { name: 'master' }),
        'recipe_version_id'
      )
      const notes = await api.getRecipeNotes(query.username, query.slug)
      return {
        recipe,
        versionId: maybeNumber(versionId),
        masterVersionId,
        notes,
        pathname
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { pathname, statusCode }
    }
  }

  public render() {
    const {
      recipe,
      versionId,
      masterVersionId,
      statusCode,
      notes,
      pathname
    } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <RecipeLayout
        recipe={recipe}
        title={`${recipe.title} - Notes`}
        description={`Notes about ${recipe.title} on PlateZero`}
        url={`${recipe.html_url}/notes`}
        pathname={pathname}
        condensedHeader={true}
        noteCount={notes.length}
        versionId={versionId}
      >
        <RecipeNotes
          notes={notes}
          recipe={recipe}
          currentVersionId={versionId || masterVersionId}
        />
      </RecipeLayout>
    )
  }
}
