import React from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Alert,
  Input
} from 'reactstrap'

import {
  Layout,
  ProcedureLists,
  IngredientLists,
  Preheats,
  RecipeTitle
} from '../components'
import {
  getRecipe,
  getRecipeVersion,
  patchBranch,
  PlateZeroApiError
} from '../common/http'
import {
  RecipeVersionJSON,
  ProcedureListJSON,
  IngredientListJSON,
  PreheatJSON
} from '../models'
import { RecipeVersionPatch } from '../common/request-models'
import { Link } from '../routes'

interface Props {
  token: string
  branch: string
  recipeVersion: RecipeVersionJSON
}

interface State {
  message: string
  errors: string[]
  procedureLists: ProcedureListJSON[]
  ingredientLists: IngredientListJSON[]
  preheats: PreheatJSON[]
}

export default class EditRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.save = this.save.bind(this)
    this.getPatch = this.getPatch.bind(this)
    this.state = {
      procedureLists: [],
      ingredientLists: [],
      preheats: [],
      errors: [],
      message: ''
    }
  }

  static async getInitialProps(ctx): Promise<Props> {
    const { query } = ctx
    const { token } = nextCookie(ctx)
    const branch = query.branch
    const recipe = await getRecipe(query.username, query.slug, { token })
    const recipeVersionId = _.get(
      _.head(_.filter(recipe.branches, { name: branch })),
      'recipe_version_id'
    )
    return {
      token,
      branch,
      recipeVersion: await getRecipeVersion(
        query.username,
        query.slug,
        recipeVersionId
      )
    }
  }

  public getPatch(): RecipeVersionPatch {
    return {
      message: this.state.message,
      ingredientLists: this.state.ingredientLists,
      procedureLists: this.state.procedureLists,
      preheats: this.state.preheats
    }
  }

  public async save() {
    this.setState({ errors: [] })
    const patch = this.getPatch()
    try {
      const slug = this.props.recipeVersion.recipe.slug
      const { branch, token } = this.props
      await patchBranch(slug, branch, patch, { token })
      Router.push(`/${this.props.recipeVersion.recipe.owner.username}/${slug}`)
    } catch (e) {
      if (e instanceof PlateZeroApiError) {
        this.setState({ errors: e.messages })
      } else {
        this.setState({ errors: ['unexpected error, please try again later'] })
      }
    }
  }

  public render() {
    const v = this.props.recipeVersion
    return (
      <Layout>
        <Head>
          <title>Editing {v.recipe.title} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col>
            <RecipeTitle recipe={v.recipe} />
          </Col>
          <Col xs="auto">
            <Link route={`/${v.recipe.owner.username}/${v.recipe.slug}`}>
              <a className="btn btn-outline-primary">Back to Recipe</a>
            </Link>
          </Col>
        </Row>
        {_.map(this.state.errors, (err, key) => (
          <Alert key={key} color="danger">
            {err}
          </Alert>
        ))}
        <h4>Preheats</h4>
        <Preheats
          preheats={v.preheats}
          onChange={preheats => this.setState({ preheats })}
        />
        <h4>Ingredients</h4>
        <IngredientLists
          lists={v.ingredientLists}
          onChange={ingredientLists => this.setState({ ingredientLists })}
        />
        <h4 className="mt-3">Instructions</h4>
        <ProcedureLists
          lists={v.procedureLists}
          onChange={procedureLists => this.setState({ procedureLists })}
        />
        <Card className="my-3">
          <CardHeader>
            <strong>Save New Version</strong>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <Input
                  type="textarea"
                  value={this.state.message}
                  placeholder="Briefly describe your changes here"
                  onChange={e => this.setState({ message: e.target.value })}
                />
              </Col>
              <Col xs="auto">
                <Button
                  color="primary"
                  onClick={this.save}
                  disabled={this.state.message === ''}
                >
                  Save Changes
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Layout>
    )
  }
}
