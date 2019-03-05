import React from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { Layout, ProfileHeader } from '../components'
import { getUser, createRecipe } from '../common/http'
import { RecipeJSON, IngredientListJSON, ProcedureListJSON } from '../models'
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

interface NewRecipeProps {
  user: UserModel
  token: string
}

export default class NewRecipe extends React.Component<
  NewRecipeProps,
  RecipeJSON
> {
  constructor(props: NewRecipeProps) {
    super(props)
    this.create = this.create.bind(this)
    this.ingredientOnChange = this.ingredientOnChange.bind(this)
    this.ingredientListNameChange = this.ingredientListNameChange.bind(this)
    this.stepOnChange = this.stepOnChange.bind(this)
    this.state = {
      title: '',
      image_url: '',
      source_url: '',
      yield: '',
      oven_preheat_temperature: '',
      oven_preheat_unit: '',
      sous_vide_preheat_temperature: 0,
      sous_vide_preheat_unit: '',
      ingredient_lists: [
        {
          name: '',
          ingredients: [
            {
              quantity_numerator: 1,
              quantity_denominator: 1,
              name: '',
              preparation: '',
              optional: false
            }
          ]
        }
      ],
      procedure_lists: [
        {
          name: '',
          steps: ['']
        }
      ]
    }
  }
  static async getInitialProps(ctx) {
    const {
      query: { username }
    } = ctx
    const { token } = nextCookie(ctx)
    return {
      user: await getUser(username, { token }),
      token
    }
  }

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
    } catch (err) {
      console.log('ERROR CRREATIN RECIPE', err)
    }
  }

  public setField = (field: string, val: string) => {
    this.setState({
      [field]: val
    })
  }

  public addIngredient = (i: number) => {
    this.setState(state => {
      const ingredients = state.ingredient_lists[i].ingredients
      ingredients.push({
        name: '',
        quantity_numerator: '',
        quantity_denominator: '',
        preparation: ''
      })
      state.ingredient_lists[i].ingredients = ingredients
      return state
    })
  }

  public addProcedureStep = () => {
    console.log('add procedure step')
    this.setState(state => ({
      procedure_lists: [
        ...state.procedure_lists,
        {
          name: '',
          steps: ['']
        }
      ]
    }))
  }

  public ingredientOnChange(list: number, ingredient: number, val: string) {
    this.setState(state => {
      const ingredients = state.ingredient_lists[list].ingredients[ingredient]
      ingredients.name = val
      return state
    })
  }

  public ingredientListNameChange(i: number, val: string) {
    console.log('name change', i, val)
    this.setState(state => {
      console.log('state', i, state)
      const list = state.ingredient_lists[i]
      list.name = val
      return state
    })
  }

  public stepOnChange(listIndex: number, stepIndex: number, val: string) {
    this.setState(state => {
      state.procedure_lists[listIndex].steps[stepIndex] = val
      return state
    })
  }

  public render() {
    return (
      <Layout user={this.props.user}>
        <Form onSubmit={this.create} className="mt-3">
          <FormGroup>
            <Label for="title">
              <strong>Title</strong>
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              required
              autoFocus={true}
              tabIndex={1}
              value={this.state.title}
              onChange={e => this.setField('title', e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="image_url">
              <strong>Image URL</strong>
            </Label>
            <Input
              type="text"
              name="image_url"
              id="image_url"
              tabIndex={2}
              value={this.state.image_url}
              onChange={e => this.setField('image_url', e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="source_url">
              <strong>Recipe Source (Where did you find this?)</strong>
            </Label>
            <Input
              type="text"
              name="source_url"
              id="source_url"
              tabIndex={3}
              value={this.state.source_url}
              onChange={e => this.setField('source_url', e.currentTarget.value)}
            />
          </FormGroup>
          <Row>
            <Col xs="3">
              <FormGroup>
                <Label for="oven_preheat_temperature">
                  <strong>Oven Preheat</strong>
                </Label>
                <Input
                  type="number"
                  name="oven_preheat_temperature"
                  id="oven_preheat_temperature"
                  tabIndex={4}
                  value={this.state.oven_preheat_temperature}
                  onChange={e =>
                    this.setField(
                      'oven_preheat_temperature',
                      e.currentTarget.value
                    )
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <h2>Ingredient Lists</h2>
          <Row>
            {this.state.ingredient_lists.map((il, i) => (
              <Col key={i} xs="12">
                <FormGroup>
                  <Label for={`procedure-${i}`}>
                    <strong>Ingredient List Name</strong>
                  </Label>
                  <Input
                    type="text"
                    name={`ingredient-list-${i}`}
                    id={`ingredient-list-${i}`}
                    value={this.state.ingredient_lists[i].name}
                    onChange={e => {
                      this.ingredientListNameChange(i, e.currentTarget.value)
                    }}
                  />
                </FormGroup>
                <h4>ingredients</h4>
                {il.ingredients.map((ingred, j) => (
                  <Input
                    key={j}
                    type="text"
                    value={ingred.name}
                    onChange={e =>
                      this.ingredientOnChange(i, j, e.currentTarget.value)
                    }
                  />
                ))}
                <Button type="button" onClick={e => this.addIngredient(i)}>
                  Add Another Ingredient
                </Button>
              </Col>
            ))}
          </Row>
          <h2>Steps</h2>
          <Row>
            {this.state.procedure_lists.map((p, i) => (
              <Col key={i} xs="12">
                <FormGroup>
                  <Label for={`procedure-${i}`}>
                    <strong>Step Name</strong>
                  </Label>
                  <Input
                    type="text"
                    name={`procedure-${i}`}
                    id={`procedure-${i}`}
                    value={this.state.procedure_lists[i].name}
                    onChange={e => this.setField('', e.currentTarget.value)}
                  />
                </FormGroup>
                {p.steps.map((pstep, j) => (
                  <Input
                    key={`pstep-${j}`}
                    type="textarea"
                    name="text"
                    id="exampleText"
                    value={this.state.procedure_lists[i].steps[j]}
                    onChange={e =>
                      this.stepOnChange(i, j, e.currentTarget.value)
                    }
                  />
                ))}
              </Col>
            ))}
          </Row>

          <Button type="button" onClick={this.addProcedureStep}>
            Add Another Step
          </Button>
          <Button type="submit" color="primary" className="btn-block">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
