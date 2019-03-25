import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { Alert, Button, Col, Form, Row } from 'reactstrap'
import { createRecipe, PlateZeroApiError } from '../common'
import { IngredientListJSON, ProcedureListJSON } from '../models'
import { PostRecipe } from '../common/request-models'
import {
  Layout,
  NewRecipeTitle,
  IngredientList,
  ProcedureList
} from '../components'
import nextCookie from 'next-cookies'
import * as _ from 'lodash'

interface Props {
  token: string
}

interface State {
  errors: string[]
  title: string
  ingredientList: IngredientListJSON
  procedureList: ProcedureListJSON
}

export default class NewRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.create = this.create.bind(this)
    this.getRecipe = this.getRecipe.bind(this)
    this.state = {
      errors: [],
      title: '',
      ingredientList: undefined,
      procedureList: undefined
    }
  }
  static async getInitialProps(ctx) {
    const { token } = nextCookie(ctx)
    return { token }
  }

  public titleOnChange = (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      title: e.currentTarget.value
    })

  public getRecipe(): PostRecipe {
    return {
      title: this.state.title,
      preheats: [],
      ingredient_lists: this.state.ingredientList
        ? [_.omit(this.state.ingredientList, 'name')]
        : [],
      procedure_lists: this.state.procedureList
        ? [this.state.procedureList]
        : []
    }
  }

  public async create(event: React.FormEvent<EventTarget>) {
    event.preventDefault()
    this.setState({ errors: [] })
    const { token } = this.props
    const recipe = this.getRecipe()
    try {
      const res = await createRecipe(recipe, { token })
      console.log('Created!', res)
      Router.push(res.html_url)
    } catch (err) {
      if (err instanceof PlateZeroApiError) {
        this.setState({ errors: err.messages })
      }
    }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>Create New Recipe on PlateZero</title>
        </Head>
        <Form onSubmit={this.create} className="mt-3">
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
          <Row>
            <Col>
              <h2>Ingredients</h2>
            </Col>
          </Row>
          <IngredientList
            ingredientList={this.state.ingredientList}
            onChange={ingredientList => this.setState({ ingredientList })}
          />
          <h2 className="my-3">Steps</h2>
          <ProcedureList
            procedureList={this.state.procedureList}
            onChange={procedureList => {
              console.log('got change', procedureList)
              this.setState({
                procedureList
              })
            }}
          />
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
