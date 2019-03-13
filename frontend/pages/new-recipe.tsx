import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { Button, Col, Form, Input, Row } from 'reactstrap'
import { Layout } from '../components'
import { createRecipe } from '../common'
import { RecipeJSON, IngredientListJSON, ProcedureListJSON } from '../models'
import {
  NewRecipeTitle,
  NewIngredientList
} from '../components'
import nextCookie from 'next-cookies'
import * as _ from 'lodash'

const nullIfFalsey = (o: any): any => {
  if (o === '') {
    return undefined
  } else if (o === 0) {
    return null
  } else if (_.isPlainObject(o)) {
    return _.mapValues(o, nullIfFalsey)
  } else if (_.isArray(o)) {
    return _.map(o, nullIfFalsey)
  }
  return o
}

interface Props {
  token: string
}

interface State extends RecipeJSON {
  errors: string[]
  ingredientList: IngredientListJSON
  procedureList: ProcedureListJSON
}

export default class NewRecipe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.create = this.create.bind(this)
    this.stepOnChange = this.stepOnChange.bind(this)
    this.state = {
      errors: [],
      ingredientList: null,
      procedureList: null,

      ingredient_lists: [],
      title: '',
      // subtitle
      // description
      // duration
      image_url: '',
      source_url: '',
      yield: '',
      preheats: [],
      procedure_lists: [
        {
          name: '',
          steps: [
            {
              text: ''
              // image_url
              // title
            }
          ]
        }
      ]
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

  public async create(event: React.FormEvent<EventTarget>) {
    console.log('create!', this.state)
    console.log('token', this.props)
    const { token } = this.props
    event.preventDefault()
    const recipe = nullIfFalsey({ ...this.state })
    delete recipe.sous_vide_preheat_temperature
    console.log('Recipeeeee', recipe)
    try {
      const res = await createRecipe(recipe, { token })
      console.log('Created!', res)
      Router.push(res.html_url)
    } catch (err) {
      console.log('ERROR CRREATIN RECIPE', err)
    }
  }

  public addProcedureStep = () => {
    console.log('add procedure step')
    this.setState(state => ({
      procedure_lists: [
        ...state.procedure_lists,
        {
          name: '',
          steps: [{ text: '' }]
        }
      ]
    }))
  }

  public stepOnChange(listIndex: number, stepIndex: number, val: string) {
    this.setState(state => {
      state.procedure_lists[listIndex].steps[stepIndex].text = val
      return state
    })
  }

  public procedureListNameChange(i: number, val: string) {
    this.setState(state => {
      state.procedure_lists[i].name = val
      return state
    })
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>Create New Recipe on PlateZero</title>
        </Head>
        <Form onSubmit={this.create} className="mt-3">
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
          <NewIngredientList
            onChange={ingredientList => this.setState({ ingredientList })}
          />
          <h2 className="my-3">Steps</h2>
          <Row>
            {this.state.procedure_lists.map((p, i) => (
              <Col key={i} xs="12" className="mb-3">
                {p.steps.map((_, j) => (
                  <Input
                    key={`pstep-${j}`}
                    type="textarea"
                    name="text"
                    id="exampleText"
                    placeholder="Step by step instructions..."
                    value={this.state.procedure_lists[i].steps[j].text}
                    onChange={e =>
                      this.stepOnChange(i, j, e.currentTarget.value)
                    }
                  />
                ))}
              </Col>
            ))}
          </Row>
          <Button
            type="button"
            outline
            color="secondary"
            onClick={this.addProcedureStep}
          >
            Add Another Step
          </Button>
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
        <pre>{JSON.stringify(this.state.procedureList, null, 2)}</pre>
      </Layout>
    )
  }
}
