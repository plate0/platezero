import React from 'react'
import nextCookie from 'next-cookies'
import Head from 'next/head'
import * as _ from 'lodash'
import { Row, Col, Button } from 'reactstrap'

import {
  Layout,
  RecipeNav,
  ProcedureList,
  IngredientList,
  IfLoggedIn
} from '../components'
import { getRecipe, getRecipeVersion } from '../common/http'
import { RecipeVersion as RecipeVersionModel } from '../models'
import { IngredientListPatch } from '../common/request-models'

interface Props {
  token: string
  branch: string
  recipeVersion: RecipeVersionModel
}

interface State {
  ingredientListPatches: { [number]: IngredientListPatch }
}

export default class EditRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.save = this.save.bind(this)
    this.getPatch = this.getPatch.bind(this)
    this.state = {
      ingredientListPatches: {}
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

  public save() {
    console.log('patching', this.getPatch())
  }

  public render() {
    const v = this.props.recipeVersion
    return (
      <Layout>
        <Head>
          <title>Editing {v.recipe.title} on PlateZero</title>
        </Head>
        <RecipeNav recipe={v.recipe} />
        <Row>
          <Col>
            <h1>Ingredients</h1>
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
              this.setState(state => ({
                ingredientListPatches: { [il.id]: patch }
              }))
            }
          />
        ))}
        <h1>Instructions</h1>
        {v.procedureLists.map((pl, key) => (
          <ProcedureList procedureList={pl} key={key} />
        ))}
      </Layout>
    )
  }
}
