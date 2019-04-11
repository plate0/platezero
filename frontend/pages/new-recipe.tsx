import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { Alert, Button, Col, Form, Row } from 'reactstrap'
import { api, PlateZeroApiError } from '../common'
import { IngredientListJSON, ProcedureListJSON, PreheatJSON } from '../models'
import { PostRecipe } from '../common/request-models'
import {
  Layout,
  NewRecipeTitle,
  IngredientLists,
  ProcedureLists,
  Preheats
} from '../components'
import * as _ from 'lodash'

interface State {
  errors: string[]
  title: string
  ingredientLists: IngredientListJSON[]
  procedureLists: ProcedureListJSON[]
  preheats: PreheatJSON[]
}

export default class NewRecipe extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.create = this.create.bind(this)
    this.getRecipe = this.getRecipe.bind(this)
    this.state = {
      errors: [],
      title: '',
      ingredientLists: [],
      procedureLists: [],
      preheats: []
    }
  }

  public titleOnChange = (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      title: e.currentTarget.value
    })

  public getRecipe(): PostRecipe {
    return {
      title: this.state.title,
      preheats: this.state.preheats,
      ingredient_lists: this.state.ingredientLists,
      procedure_lists: this.state.procedureLists
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
          <h2>Preheats</h2>
          <Preheats
            preheats={[]}
            onChange={preheats => this.setState({ preheats })}
          />
          <h2>Ingredients</h2>
          <IngredientLists
            lists={[defaultIngredientList]}
            onChange={ingredientLists => this.setState({ ingredientLists })}
          />
          <h2 className="my-3">Steps</h2>
          <ProcedureLists
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
