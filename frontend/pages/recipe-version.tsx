import React from 'react'
import * as _ from 'lodash'
import { Card, CardHeader, CardBody } from 'reactstrap'
import ErrorPage from './_error'
import {
  RecipeLayout,
  RecipeVersion,
  Timestamp,
  Markdown,
  PinnedNotes
} from '../components'
import { RecipeJSON, RecipeVersionJSON, NoteJSON } from '../models'
import { api } from '../common/http'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'

interface RecipeVersionProps {
  recipe?: RecipeJSON
  notes?: NoteJSON[]
  recipeVersion?: RecipeVersionJSON
  statusCode?: number
}

export default class RecipeVersionPage extends React.Component<
  RecipeVersionProps
> {
  static async getInitialProps({ query, res }) {
    try {
      const { username, slug } = query
      const recipe = await api.getRecipe(username, slug)
      return {
        recipe,
        notes: await api.getRecipeNotes(username, slug),
        recipeVersion: await api.getRecipeVersion(
          username,
          slug,
          parseInt(query.versionId, 10)
        )
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    if (this.props.statusCode) {
      return <ErrorPage statusCode={this.props.statusCode} />
    }
    const { recipe, recipeVersion, notes } = this.props
    return (
      <RecipeLayout
        title={recipe.title}
        description={recipe.description}
        recipe={recipe}
        url={recipe.html_url}
        pathname={'/recipe'}
        condensedHeader={true}
        versionId={recipeVersion.id}
        noteCount={notes.length}
      >
        <Card className="mb-3">
          <CardHeader className="theme-warning d-flex align-items-center justify-content-between">
            <div>Viewing a specific version of this recipe</div>
            <Link
              route="recipe"
              params={{ username: recipe.owner.username, slug: recipe.slug }}
            >
              <a className="btn btn-link btn-sm">Show Master Version</a>
            </Link>
          </CardHeader>
          <CardBody>
            <Markdown source={recipeVersion.message} />
            <div className="text-secondary small mt-3">
              Authored <Timestamp t={recipeVersion.created_at} /> by{' '}
              <Link
                route="/user"
                params={{ username: recipeVersion.author.username }}
              >
                <a className="font-weight-bold text-secondary">
                  {getName(recipeVersion.author)}
                </a>
              </Link>
            </div>
          </CardBody>
        </Card>
        <PinnedNotes
          currentVersionId={recipeVersion.id}
          recipe={recipe}
          notes={notes}
        />
        <RecipeVersion version={recipeVersion} />
      </RecipeLayout>
    )
  }
}
