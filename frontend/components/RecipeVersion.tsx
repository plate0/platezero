import React, { useState, useContext } from 'react'
import * as moment from 'moment'
import * as _ from 'lodash'
import { Button, Row, Col } from 'reactstrap'
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
import { RecipeNav } from './RecipeNav'

const Share = ({ link, className, style = {} }) => (
  <Button
    color="primary"
    className={`text-white rounded-circle shadow ${className}`}
    style={{
      height: 55,
      width: 55,
      ...style
    }}
    onClick={e => {
      if (navigator.canShare && navigator.canShare()) {
        navigator.share({
          title: document.title,
          text: 'The WebKit Blog',
          url: 'https://webkit.org/blog'
        })
      }
    }}
  >
    <i className="fal fa-share-square" style={{ fontSize: 22 }} />
  </Button>
)

export const RecipeVersion = (props: { recipeVersion: RecipeVersionJSON }) => {
  const [imageUrl, setImageUrl] = useState(props.recipeVersion.recipe.image_url)
  const [updateImageErrors, setUpdateImageErrors] = useState(null)
  const userContext = useContext(UserContext)

  const v = props.recipeVersion
  const d = _.get(v, 'recipeDuration.duration_seconds')
  const src = 'www.blueapron.com'
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
      <Row className="position-relative">
        <Col xs="12" className="px-0 px-sm-3 overflow-hidden">
          <div className="position-relative">
            <img
              className="w-100 d-print-none"
              src={imageUrl}
              itemProp="image"
              alt={`Picture of ${v.recipe.title}`}
            />
            <div
              className="position-absolute text-white w-100 p-2 pt-5"
              style={{
                bottom: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,.70))'
              }}
            >
              <h1 className="m-0">{v.recipe.title}</h1>
              <h5 className="m-0">{v.recipe.subtitle}</h5>
              <a
                href={`/${v.author.username}`}
                itemProp="author"
                className="text-white"
              >
                {getName(v.author)}
              </a>{' '}
              <span>from {src}</span>
              <ul className="stats list-group list-unstyled list-group-horizontal font-weight-light">
                <li className="align-items-center d-flex justify-content-center flex-fill">
                  <span style={{ fontSize: 24 }} className="mr-2">
                    2
                  </span>{' '}
                  Servings
                </li>
                <li className="align-items-center d-flex justify-content-center flex-fill">
                  <time
                    itemProp="cookTime"
                    dateTime={`PT${d}S`}
                    className="d-flex align-items-center"
                  >
                    <span style={{ fontSize: 24 }} className="mr-2">
                      30
                    </span>{' '}
                    Minutes
                  </time>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Share
          link={'http://google.com'}
          className="position-absolute"
          style={{ right: 25, bottom: -20 }}
        />
      </Row>
      <Row>
        <Col xs="12">
          <RecipeNav recipe={v.recipe} route={''} />
        </Col>
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
      </Row>
      <Row className="mt-3">
        <Col>
          <p style={{ lineHeight: '2rem' }}>{v.recipe.description}</p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs="12" md="6" lg="4">
          <h2 className="border-bottom">Ingredients</h2>
          <IngredientLists lists={v.ingredientLists} />
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2 className="border-bottom">Instructions</h2>
          <ProcedureLists lists={v.procedureLists} />
        </Col>
      </Row>
    </>
  )

  /*
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
  */
}
