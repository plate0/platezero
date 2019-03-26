import React from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import * as _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody
} from 'reactstrap'
import {
  Head,
  Layout,
  IfLoggedIn,
  RecipeNav,
  RecipeVersion as RecipeVersionView
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getRecipe, getRecipeVersion, deleteRecipe } from '../common/http'
import { Link } from '../routes'

interface Props {
  token: string
  recipe: RecipeJSON
  recipeVersion?: RecipeVersionJSON
}

interface State {
  showDeleteModal: boolean
}

export default class Recipe extends React.Component<Props, State> {
  static async getInitialProps(ctx): Promise<Props> {
    const { query } = ctx
    const { token } = nextCookie(ctx)
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { token, recipe, recipeVersion }
  }

  constructor(props) {
    super(props)
    this.state = {
      showDeleteModal: false
    }
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
        <RecipeNav recipe={recipe} />
        <IfLoggedIn username={recipe.owner.username}>
          <RecipeEditButton recipe={recipe} branch="master" />{' '}
          <Button
            color="danger"
            outline
            size="sm"
            onClick={() => this.setState({ showDeleteModal: true })}
          >
            Delete&hellip;
          </Button>
        </IfLoggedIn>
        {recipe.description && (
          <Card className="mb-3">
            <CardHeader>
              <strong>About {recipe.title}</strong>
            </CardHeader>
            <CardBody>
              <ReactMarkdown
                source={recipe.description}
                disallowedTypes={[
                  'link',
                  'image',
                  'linkReference',
                  'imageReference',
                  'html',
                  'virtualHtml'
                ]}
              />
            </CardBody>
          </Card>
        )}
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
        <Modal
          isOpen={this.state.showDeleteModal}
          toggle={() =>
            this.setState(state => ({
              showDeleteModal: !state.showDeleteModal
            }))
          }
        >
          <ModalBody>
            <h5>Permanently delete {recipe.title}</h5>
            <p>
              Are you sure you want to permanently delete{' '}
              <strong>{recipe.title}</strong>?
            </p>
            <Button
              color="danger"
              block
              onClick={() =>
                deleteRecipe(recipe.slug, { token: this.props.token }).then(
                  () => Router.push('/')
                )
              }
            >
              Yes, delete it forever
            </Button>
            <Button
              color="link"
              className="text-muted"
              outline
              block
              onClick={() => this.setState({ showDeleteModal: false })}
            >
              Never mind, keep it for now
            </Button>
          </ModalBody>
        </Modal>
      </Layout>
    )
  }
}

interface RecipeEditButtonProps {
  recipe: RecipeJSON
  branch: string
}
const RecipeEditButton = (props: RecipeEditButtonProps) => (
  <Link
    route={`/${props.recipe.owner.username}/${props.recipe.slug}/branches/${
      props.branch
    }/edit`}
  >
    <a className="btn btn-sm btn-outline-primary">Edit</a>
  </Link>
)
