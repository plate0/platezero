import React, { useState, useContext } from 'react'
import Router from 'next/router'
import * as _ from 'lodash'
import { Modal, ModalBody, Button } from 'reactstrap'
import {
  Head,
  Layout,
  UserCard,
  IfLoggedIn,
  RecipeVersion as RecipeVersionView
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getRecipe, getRecipeVersion, deleteRecipe } from '../common/http'
import { Link } from '../routes'
import { UserContext } from '../context/UserContext'
import { TokenContext } from '../context/TokenContext'

interface Props {
  recipe: RecipeJSON
  recipeVersion?: RecipeVersionJSON
}

export default class Recipe extends React.Component<Props> {
  static async getInitialProps({ query }): Promise<Props> {
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { recipe, recipeVersion }
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
        <div className="my-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1>
                <Link route={`/${recipe.owner.username}/${recipe.slug}`}>
                  <a>{recipe.title}</a>
                </Link>
              </h1>
              {recipe.subtitle && <div className="lead">{recipe.subtitle}</div>}
            </div>
            <UserCard user={recipe.owner} />
          </div>
          <div className="text-right">
            {recipe.source_url && (
              <a
                target="_blank"
                href={recipe.source_url}
                className="btn btn-link btn-sm"
              >
                View Original <i className="fal fa-external-link" />
              </a>
            )}{' '}
            <IfLoggedIn username={recipe.owner.username}>
              <EditButton recipe={recipe} branch="master" />{' '}
              <DeleteButton recipe={recipe} />
            </IfLoggedIn>
          </div>
        </div>
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
      </Layout>
    )
  }
}

const EditButton = (props: { recipe: RecipeJSON; branch: string }) => (
  <Link
    route={`/${props.recipe.owner.username}/${props.recipe.slug}/branches/${
      props.branch
    }/edit`}
  >
    <a className="btn btn-sm btn-outline-primary">Edit</a>
  </Link>
)

const DeleteButton = (props: { recipe: RecipeJSON }) => {
  const [isOpen, setOpen] = useState(false)
  const user = useContext(UserContext)
  const token = useContext(TokenContext)
  const handleDelete = async () => {
    try {
      await deleteRecipe(props.recipe.slug, { token })
    } catch {}
    Router.push(`/${user.username}`)
  }
  return (
    <>
      <Button color="danger" outline size="sm" onClick={() => setOpen(true)}>
        Delete&hellip;
      </Button>
      <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen)}>
        <ModalBody>
          <h5>Permanently delete {props.recipe.title}</h5>
          <p>
            Are you sure you want to permanently delete{' '}
            <strong>{props.recipe.title}</strong>?
          </p>
          <Button color="danger" block onClick={handleDelete}>
            Yes, delete it forever
          </Button>
          <Button
            color="link"
            className="text-muted"
            outline
            block
            onClick={() => setOpen(false)}
          >
            Never mind, keep it for now
          </Button>
        </ModalBody>
      </Modal>
    </>
  )
}
