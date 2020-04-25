import React, { useReducer } from 'react'
import { Row, Col } from 'reactstrap'
import * as _ from 'lodash'
import { Head, Layout, RecipeHeader, RecipeNav } from '../components'
import { RecipeContext } from '../context/RecipeContext'
import { RecipeJSON, RecipeVersionJSON, NoteJSON } from '../models'
import ErrorPage from '../pages/_error'
import { maybeNumber } from '../common/number'
import { api } from '../common/http'

enum NoteAction {
  CREATE,
  UPDATE,
  DELETE
}
function notesReducer(state, action) {
  switch (action.type) {
    case NoteAction.CREATE:
      return [action.note, ...state]
    case NoteAction.UPDATE:
      return _.map(state, (note) =>
        note.id === action.note.id ? action.note : note
      )
    case NoteAction.DELETE:
      return _.reject(state, (note) => note.id === action.noteId)
    default:
      return state
  }
}

export interface RecipeLayoutProps {
  pathname: string
  statusCode?: number
  recipe?: RecipeJSON
  masterVersionId?: number
  explicitVersionId?: number
  viewingVersion?: RecipeVersionJSON
  notes?: NoteJSON[]
  children?: any
  condensedHeader?: boolean
}

export const fetchRecipeLayoutProps = async ({
  pathname,
  query,
  res
}): Promise<RecipeLayoutProps> => {
  try {
    const { username, slug, versionId } = query
    console.log(`username: ${username}, slug: ${slug}`)
    const recipe = await api.getRecipe(username, slug)
    console.log(`recipe: ${recipe}`)
    const masterVersionId = _.get(
      _.find(recipe.branches, { name: 'master' }),
      'recipe_version_id'
    )
    if (!masterVersionId) {
      throw new Error('Could not find master recipe version')
    }
    return {
      pathname,
      recipe,
      masterVersionId,
      explicitVersionId: maybeNumber(versionId),
      viewingVersion: await api.getRecipeVersion(
        username,
        slug,
        maybeNumber(versionId) || masterVersionId
      ),
      notes: await api.getRecipeNotes(username, slug)
    }
  } catch (err) {
    const statusCode = err.statusCode || 500
    if (res) {
      res.statusCode = statusCode
    }
    return { pathname, statusCode }
  }
}

export const RecipeLayout = ({
  statusCode,
  pathname,
  condensedHeader,
  children,
  recipe,
  notes: initialNotes,
  masterVersionId,
  explicitVersionId,
  viewingVersion
}: RecipeLayoutProps) => {
  const { title, description, image_url, html_url } = recipe
  const [notes, dispatch] = useReducer(notesReducer, initialNotes)
  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />
  }
  return (
    <Layout title={title}>
      <Head
        title={title}
        description={description}
        image={image_url}
        url={html_url}
      />
      <RecipeContext.Provider
        value={{
          recipe,
          notes,
          masterVersionId,
          explicitVersionId,
          viewingVersion,
          addNote: (note: NoteJSON) =>
            dispatch({ type: NoteAction.CREATE, note }),
          removeNote: (noteId: number) =>
            dispatch({ type: NoteAction.DELETE, noteId }),
          editNote: (note: NoteJSON) =>
            dispatch({ type: NoteAction.UPDATE, note })
        }}
      >
        <Row className="position-relative">
          <RecipeHeader recipe={recipe} condensed={!!condensedHeader} />
        </Row>
        <Row>
          <Col xs="12" className="px-0 px-sm-3">
            <RecipeNav route={pathname} />
          </Col>
        </Row>
        {children}
      </RecipeContext.Provider>
    </Layout>
  )
}
