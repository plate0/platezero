import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { api, PlateZeroApiError } from '../common'
import {
  Alert,
  Button,
  Col,
  Form,
  Row,
  FormGroup,
  Input,
  Label,
  FormText
} from 'reactstrap'
import {
  IngredientListJSON,
  ProcedureListJSON,
  PreheatJSON,
  RecipeYieldJSON,
  RecipeDurationJSON
} from '../models'
import { PostRecipe } from '../common/request-models'
import {
  Layout,
  NewRecipeTitle,
  IngredientListsEditor,
  ProcedureListsEditor,
  PreheatsEditor,
  RecipeYield,
  RecipeDuration
} from '../components'
import * as _ from 'lodash'
import { normalize } from '../common/model-helpers'
import { Link } from '../routes'

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
      if (err instanceof PlateZeroApiError) {
        this.setState({ errors: err.messages })
      }
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
          {this.state.errors.map((err, key) => (
            <Alert key={key} color="danger">
              {err}
            </Alert>
          ))}
          <Row>
            <Col xs="12">
              <NewRecipeTitle
                value={this.state.title}
                onChange={this.titleOnChange}
              />
            </Col>
          </Row>

          <FormGroup>
            <Label>Source URL</Label>
            <Input
              type="text"
              value={this.state.source_url}
              placeholder="e.g. https://example.com/recipe.html"
              onChange={e => this.setState({ source_url: e.target.value })}
            />
            <FormText>
              Pro tip: Try our{' '}
              <Link route="/recipes/import">
                <a>importer</a>
              </Link>{' '}
              instead!
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label>Source Author</Label>
            <Input
              type="text"
              value={this.state.source_author}
              placeholder="e.g. Firstname Lastname"
              onChange={e => this.setState({ source_author: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Source ISBN</Label>
            <Input
              type="text"
              value={this.state.source_isbn}
              placeholder="e.g. 9780000000000"
              onChange={e => this.setState({ source_isbn: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Source Title</Label>
            <Input
              type="text"
              value={this.state.source_title}
              placeholder="e.g. Cookbook"
              onChange={e => this.setState({ source_title: e.target.value })}
            />
          </FormGroup>

          <RecipeYield
            yield={this.state.recipeYield}
            onChange={recipeYield => this.setState({ recipeYield })}
          />
          <RecipeDuration
            duration={this.state.recipeDuration}
            onChange={recipeDuration => this.setState({ recipeDuration })}
          />
          <h2>Preheats</h2>
          <PreheatsEditor
            preheats={[]}
            onChange={preheats => this.setState({ preheats })}
          />
          <h2>Ingredients</h2>
          <IngredientListsEditor
            lists={[defaultIngredientList]}
            onChange={ingredientLists => this.setState({ ingredientLists })}
          />
          <h2 className="my-3">Steps</h2>
          <ProcedureListsEditor
            lists={[defaultProcedureList]}
            onChange={procedureLists => this.setState({ procedureLists })}
          />
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
