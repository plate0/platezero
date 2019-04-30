import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { api, getErrorMessages } from '../common'
import { Row, Col, Button, Form, FormGroup, Input, Label } from 'reactstrap'
import {
  IngredientListJSON,
  ProcedureListJSON,
  PreheatJSON,
  RecipeYieldJSON,
  RecipeDurationJSON
} from '../models'
import { PostRecipe } from '../common/request-models'
import {
  AlertErrors,
  Layout,
  IngredientListsEditor,
  ProcedureListsEditor,
  PreheatsEditor,
  RecipeYield,
  RecipeDuration,
  RecipeAttributionEditor
} from '../components'
import * as _ from 'lodash'
import { normalize } from '../common/model-helpers'

interface State {
  errors: string[]
  title: string
  source_url: string
  source_title: string
  source_author: string
  source_isbn: string
  ingredientLists: IngredientListJSON[]
  procedureLists: ProcedureListJSON[]
  preheats: PreheatJSON[]
  recipeYield: RecipeYieldJSON | undefined
  recipeDuration: RecipeDurationJSON | undefined
}

export default class NewRecipe extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.create = this.create.bind(this)
    this.getRecipe = this.getRecipe.bind(this)
    this.state = {
      errors: [],
      title: '',
      source_url: '',
      source_title: '',
      source_author: '',
      source_isbn: '',
      ingredientLists: [],
      procedureLists: [],
      preheats: [],
      recipeYield: undefined,
      recipeDuration: undefined
    }
  }

  public titleOnChange = (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      title: e.currentTarget.value
    })

  public getRecipe(): PostRecipe {
    return {
      title: this.state.title,
      source_url: normalize(this.state.source_url),
      source_author: normalize(this.state.source_author),
      source_title: normalize(this.state.source_title),
      source_isbn: normalize(this.state.source_isbn),
      preheats: this.state.preheats,
      ingredient_lists: this.state.ingredientLists,
      procedure_lists: this.state.procedureLists,
      yield: _.get(this.state.recipeYield, 'text'),
      duration: _.get(this.state.recipeDuration, 'duration_seconds')
    }
  }

  public async create(event: React.FormEvent<EventTarget>) {
    event.preventDefault()
    this.setState({ errors: [] })
    const recipe = this.getRecipe()
    try {
      const res = await api.createRecipe(recipe)
      Router.push(res.html_url)
    } catch (err) {
      this.setState({ errors: getErrorMessages(err) })
    }
  }

  public render() {
    const defaultIngredientList = { name: undefined, lines: [] }
    const defaultProcedureList = { name: undefined, lines: [] }
    return (
      <Layout>
        <Head>
          <title>Create New Recipe on PlateZero</title>
        </Head>
        <Form onSubmit={this.create} className="mt-3 pb-5">
          <AlertErrors errors={this.state.errors} />
          <FormGroup>
            <Label for="title">
              <h5>Title</h5>
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="e.g. Banana Bread"
              required
              autoFocus={true}
              tabIndex={1}
              value={this.state.title}
              onChange={this.titleOnChange}
            />
          </FormGroup>
          <Row>
            <Col xs={12} md={6}>
              <RecipeYield
                yield={this.state.recipeYield}
                onChange={recipeYield => this.setState({ recipeYield })}
              />
            </Col>
            <Col xs={12} md={6}>
              <RecipeDuration
                duration={this.state.recipeDuration}
                onChange={recipeDuration => this.setState({ recipeDuration })}
              />
            </Col>
          </Row>
          <h5>Preheats</h5>
          <PreheatsEditor
            preheats={[]}
            onChange={preheats => this.setState({ preheats })}
          />
          <h5>Ingredients</h5>
          <IngredientListsEditor
            lists={[defaultIngredientList]}
            onChange={ingredientLists => this.setState({ ingredientLists })}
          />
          <h5 className="my-3">Steps</h5>
          <ProcedureListsEditor
            lists={[defaultProcedureList]}
            onChange={procedureLists => this.setState({ procedureLists })}
          />
          <h5 className="my-3">Attribution</h5>
          <RecipeAttributionEditor
            source_url=""
            source_title=""
            source_author=""
            source_isbn=""
            onChange={delta => this.setState(delta)}
          />
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
