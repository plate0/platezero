import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import ErrorPage from './_error'
import * as _ from 'lodash'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  FormText
} from 'reactstrap'

import {
  AlertErrors,
  EditableImage,
  Layout,
  ProcedureListsEditor,
  IngredientListsEditor,
  PreheatsEditor,
  RecipeDuration,
  RecipeYield
} from '../components'
import { api, getErrorMessages } from '../common/http'
import {
  RecipeVersionJSON,
  ProcedureListJSON,
  IngredientListJSON,
  PreheatJSON,
  RecipeDurationJSON,
  RecipeYieldJSON
} from '../models'
import { RecipeVersionPatch } from '../common/request-models'
import { Link } from '../routes'

interface Props {
  branch?: string
  recipeVersion?: RecipeVersionJSON
  statusCode?: number
}

interface State {
  message: string
  errors: string[]
  procedureLists: ProcedureListJSON[]
  ingredientLists: IngredientListJSON[]
  preheats: PreheatJSON[]
  recipeYield: RecipeYieldJSON | undefined
  recipeDuration: RecipeDurationJSON | undefined
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
      message: '',
      recipeYield: undefined,
      recipeDuration: undefined
    }
  }

  static async getInitialProps({ query, res }): Promise<Props> {
    try {
      const { branch, username, slug } = query
      const recipe = await api.getRecipe(username, slug)
      const recipeVersionId = _.get(
        _.head(_.filter(recipe.branches, { name: branch })),
        'recipe_version_id'
      )
      return {
        branch,
        recipeVersion: await api.getRecipeVersion(
          query.username,
          query.slug,
          recipeVersionId
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

  public getPatch(): RecipeVersionPatch {
    return {
      message: this.state.message,
      ingredientLists: this.state.ingredientLists,
      procedureLists: this.state.procedureLists,
      preheats: this.state.preheats,
      recipeYield: this.state.recipeYield,
      recipeDuration: this.state.recipeDuration
    }
  }

  public async save() {
    this.setState({ errors: [] })
    const patch = this.getPatch()
    try {
      const slug = this.props.recipeVersion.recipe.slug
      const { branch } = this.props
      await api.patchBranch(slug, branch, patch)
      Router.push(`/${this.props.recipeVersion.recipe.owner.username}/${slug}`)
    } catch (e) {
      this.setState({ errors: getErrorMessages(e) })
    }
  }

  onRecipeImageEdit = async (image_url: string) => {
    const v = this.props.recipeVersion
    try {
      await api.patchRecipe(v.recipe.slug, { image_url })
      location.reload()
    } catch (err) {
      this.setState({ errors: getErrorMessages(err) })
    }
  }

  public render() {
    if (this.props.statusCode) {
      return <ErrorPage statusCode={this.props.statusCode} />
    }
    const v = this.props.recipeVersion
    return (
      <Layout>
        <Head>
          <title>Editing {v.recipe.title} on PlateZero</title>
        </Head>
        <Row>
          <Col xs="12">
            <img
              className="w-100"
              src={v.recipe.image_url}
              style={{ objectFit: 'cover', height: 200 }}
            />
            <EditableImage
              hasExisting={!!v.recipe.image_url}
              onUpdate={this.onRecipeImageEdit}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <h1>{v.recipe.title}</h1>
          </Col>
          <Col xs="auto">
            <Link route={`/${v.recipe.owner.username}/${v.recipe.slug}`}>
              <a className="btn btn-outline-primary">Back to Recipe</a>
            </Link>
          </Col>
        </Row>
        <AlertErrors errors={this.state.errors} />
        <Row>
          <Col xs={12} md={6}>
            <RecipeYield
              yield={v.recipeYield}
              onChange={recipeYield => this.setState({ recipeYield })}
            />
          </Col>
          <Col xs={12} md={6}>
            <RecipeDuration
              duration={v.recipeDuration}
              onChange={recipeDuration => this.setState({ recipeDuration })}
            />
          </Col>
        </Row>
        <h4>Preheats</h4>
        <PreheatsEditor
          preheats={v.preheats}
          onChange={preheats => this.setState({ preheats })}
        />
        <h4 className="mt-3">Ingredients</h4>
        <IngredientListsEditor
          lists={v.ingredientLists}
          onChange={ingredientLists => this.setState({ ingredientLists })}
        />
        <h4 className="mt-3">Instructions</h4>
        <ProcedureListsEditor
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
                <FormGroup>
                  <Input
                    type="textarea"
                    value={this.state.message}
                    placeholder="e.g. Remove crushed red pepper to make it less spicy"
                    onChange={e => this.setState({ message: e.target.value })}
                  />
                  <FormText>
                    In the future, your message will help remind you what you
                    changed and why you changed it.
                  </FormText>
                </FormGroup>
              </Col>
              <Col xs="12" sm="4" lg="2">
                <p>
                  <Button
                    color="primary"
                    block
                    onClick={this.save}
                    disabled={this.state.message === ''}
                  >
                    Save Changes
                  </Button>
                </p>
                {this.state.message === '' ? (
                  <p className="small text-secondary">
                    Add a message in order to save your changes
                  </p>
                ) : (
                  <p className="small text-success">Nice work!</p>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Layout>
    )
  }
}
