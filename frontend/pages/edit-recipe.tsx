import React from 'react'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'
import { Row, Col, Button, Alert } from 'reactstrap'

import {
  Layout,
  RecipeNav,
  ProcedureList,
  IngredientList,
  IfLoggedIn
} from '../components'
import {
  getRecipe,
  getRecipeVersion,
  patchBranch,
  PlateZeroApiError
} from '../common/http'
import { RecipeVersionJSON } from '../models'
import {
  RecipeVersionPatch,
  IngredientListPatch
} from '../common/request-models'

interface Props {
  token: string
  branch: string
  recipeVersion: RecipeVersionJSON
}

interface State {
  ingredientListPatches: { [id: number]: IngredientListPatch }
  errors: string[]
}

export default class EditRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.save = this.save.bind(this)
    this.getPatch = this.getPatch.bind(this)
    this.state = {
      ingredientListPatches: {},
      errors: []
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
      changedIngredientLists: _.reject(
        _.values(this.state.ingredientListPatches),
        _.isUndefined
      )
    }
  }

  public async save() {
    this.setState({ errors: [] })
    const patch = this.getPatch()
    console.log('patching', patch)
    try {
      const slug = this.props.recipeVersion.recipe.slug
      const { branch, token } = this.props
      const newVersion = await patchBranch(slug, branch, patch, { token })
      console.log('applied, new version', newVersion)
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
        <RecipeNav recipe={v.recipe} />
        {_.map(this.state.errors, (err, key) => (
          <Alert key={key} color="danger">
            {err}
          </Alert>
        ))}
        <Row>
          <Col>
            <h4>Ingredients</h4>
          </Col>
          <Col xs="auto">
            <IfLoggedIn>
              <Button color="primary" onClick={this.save}>
                Save Changes
              </Button>
            </IfLoggedIn>
          </Col>
        </Row>
        {v.ingredientLists.map(il => (
          <IngredientList
            key={il.id}
            ingredientList={il}
            onChange={(_, patch) =>
              this.setState({ ingredientListPatches: { [il.id]: patch } })
            }
          />
        ))}
        <h4 className="mt-3">Instructions</h4>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList procedureList={pl} key={key} />
        ))}
      </Layout>
    )
  }
}
