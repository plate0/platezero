import React, { useState, useContext } from 'react'
import * as moment from 'moment'
import * as _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { Timestamp, humanize } from './Timestamp'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { AlertErrors } from './AlertErrors'
import { EditableImage } from './EditableImage'
import { RecipeVersionVitals } from './RecipeVersionVitals'
import { Markdown } from './Markdown'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getName } from '../common/model-helpers'
import { api, getErrorMessages } from '../common/http'
import { UserContext } from '../context/UserContext'

export const RecipeVersion = (props: { recipeVersion: RecipeVersionJSON }) => {
  const [imageUrl, setImageUrl] = useState(props.recipeVersion.recipe.image_url)
  const [updateImageErrors, setUpdateImageErrors] = useState(null)
  const userContext = useContext(UserContext)

  const v = props.recipeVersion
  const prevUrl = v.parent_recipe_version_id
    ? `/${v.recipe.owner.username}/${v.recipe.slug}/versions/${
        v.parent_recipe_version_id
      }`
    : undefined

  const onRecipeImageEdit = async (image_url: string) => {
    try {
      await api.patchRecipe(v.recipe.slug, { image_url })
      setImageUrl(image_url)
    } catch (err) {
      setUpdateImageErrors(getErrorMessages(err))
    }
  }

  return (
    <>
      <details className="mb-3">
        <summary>
          Authored by{' '}
          <a href={`/${v.author.username}`} itemProp="author">
            {getName(v.author)}
          </a>{' '}
          <Timestamp itemProp="dateModified" t={moment(v.created_at)} />{' '}
        </summary>
        <div className="bg-light p-3">
          <Markdown source={v.message} />
          <div className="small text-muted pt-1 border-top">
            {humanize(moment(v.created_at))}
            {prevUrl && (
              <a href={prevUrl} className="ml-2">
                Previous Version
              </a>
            )}
          </div>
        </div>
      </details>
      <RecipeVersionVitals recipeVersion={v} />
      <Row>
        <Col xs="12" md="6" lg="4">
          <EditableImage
            src={imageUrl}
            onUpdate={onRecipeImageEdit}
            canEdit={
              v.recipe.owner.username === _.get(userContext, 'user.username')
            }
          >
            <img
              className="w-100"
              src={imageUrl}
              itemProp="image"
              alt={`Picture of ${v.recipe.title}`}
            />
          </EditableImage>
          <AlertErrors errors={updateImageErrors} />
          <h2>Ingredients</h2>
          <IngredientLists lists={v.ingredientLists} />
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2>Instructions</h2>
          <ProcedureLists lists={v.procedureLists} />
        </Col>
      </Row>
    </>
  )
}
